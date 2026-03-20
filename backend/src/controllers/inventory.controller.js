const pool = require('../config/db');

async function getInventory(req, resp) {
    const { productId } = req.params;
    const [rows] = await pool.query(`
        SELECT * FROM inventory WHERE product_id = ?`, [productId]);

    if(!rows.length) {
        return resp.status(404).json({
            message: 'Inventory not found'
        });
    }

    return resp.json(rows[0]);
}

async function updateInventory(req, resp) {
    const { productId } = req.params;
    const { quantity, reserved_quantity } = req.body;
    await pool.query(`
        UPDATE inventory
        SET quantity = COALESCE(?, quantity),
        reserved_quantity = COALESCE(?, reserved_quantity)
        WHERE product_id = ?)`, [quantity, reserved_quantity, productId]
    );

    return resp.json({
        message: 'Inventory updated'
    });
}

module.exports = {
    getInventory, 
    updateInventory
}