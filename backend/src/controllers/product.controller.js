const pool = require('../config/db');

async function listProducts(req, resp) {
    const [rows] = await pool.query(`
        SELECT p.id, p.name, p.category, p.price, p.is_active, 
        COALESCE(i.quantity, 0) AS quantity, 
        COALESCE(i.reserved_quantity, 0) AS reserved_quantity
        FROM products p
        LEFT JOIN inventory i ON p.id = i.product_id
        ORDER  BY p.id DESC`
    );

    return resp.json(rows);
}


async function getProductById(req, resp) {
    const { id } = req.params;
    const [rows] = await pool.query(`
        SELECT p.id, p.category, p.name, p.price, p.is_active, 
        COALESCE(i.quantity, 0) AS quantity, 
        COALESCE(i.reserved_quantity, 0) AS reserved_quantity
        FROM products p
        LEFT JOIN inventory i ON p.id = i.product_id
        WHERE p.id = ?
        `, [id]);

        if(!rows.length) {
            return resp.status(404).json({
                message: 'Product not found'
            });
        }

    return resp.json(rows[0]);
}

async function createProduct(req, resp) {
    const { name, category, price, quantity = 0 } = req.body;
    const conn = await pool.getConnection(); // we need a transaction here because we are inserting into two tables and we want to make sure both inserts succeed or both fail together.
    try {
        await conn.beginTransaction();

        const [result] = await conn.query(
            'INSERT INTO products (name, category, price) VALUES (?, ?, ?)',
            [name, category, price]
        );

        await conn.query (
            'INSERT INTO inventory (product_id, quantity, reserved_quantity) VALUES (?, ?, 0)', 
            [result.insertId, quantity] 
        );

        await conn.commit();
        return resp.status(201).json({
            message: 'Product created', 
            productId: result.insertId
        })
    } catch(error) {
        await conn.rollback();
        return resp.status(500).json({
            message: 'Error creating product',
            error: error.message
        })
    } finally {
        conn.release();
    }
}


async function updateProduct(req, resp) {
    const { name, category, price, is_active } = req.body;
    const { id } = req.params;

    const [result] = await pool.query( // COALESCE allows us to only update the fields that are provided in the request body, if a field is not provided, it will keep its current value in the database.
        `UPDATE products 
        SET name = COALESCE(?, name), 
        category = COALESCE(?, category), 
        price = COALESCE(?, price), 
        is_active = COALESCE(?, is_active)
        WHERE id = ?`,
        [name, category, price, is_active, id]
    );

    return resp.json({
        message: 'Product updated',
        result: result[0]
    })
}

async function deleteProduct(req, resp) {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return resp.json({
        message: 'Product deleted'
    });
}

module.exports = {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}