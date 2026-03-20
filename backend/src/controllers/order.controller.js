const pool = require('../config/db');

async function createOrder(req, resp) {
    const { items, shipping_address } = req.body;

    if(!Array.isArray(items) || items.length === 0) {
        return resp.status(400).json({
            message: 'Order items are required'
        })
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        let totalAmount = 0;
        const resolvedItems = [];

        for(const item of items) {
            const { product_id, quantity } = item;

            if(!product_id || !quantity || quantity <= 0) {
                throw new Error('Invalid product_id or quantity');
            }

            const [productRows] = await conn.query(`
                SELECT p.id, p.name, p.price, p.is_active, i.quantity
                FROM products p
                JOIN inventory i ON p.id = i.product_id
                WHERE p.id = ? FOR UPDATE`, [product_id]
            );

            if(!productRows.length) {
                throw new Error(`Product with id ${product_id} not found`);
            }

            const product = productRows[0];
            if(!product.is_active) {
                throw new Error(`Product ${product.name} is not available for purchase`);
            }

            if(product.quantity < quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            const itemTotal = Number(product.price) * quantity;
            totalAmount += itemTotal;

            resolvedItems.push({
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity,
                line_total: itemTotal
            });
        }

        const [orderResult] = await conn.query(`
            INSERT INTO orders (user_id, total_amount, shipping_address)
            VALUES (?, ?, ?)`, [req.user.id, totalAmount, shipping_address]
        );

        const orderId = orderResult.insertId;

        for(const item of resolvedItems) {
            await conn.query(`
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
                VALUES (?, ?, ?, ?, ?)`, [orderId, item.product_id, item.quantity, item.price, item.line_total]
            );

            await conn.query(`
                UPDATE inventory
                SET quantity = quantity - ?
                WHERE product_id = ?`, [item.quantity, item.product_id]
            );
        }

        await conn.commit();
        return resp.status(201).json({
            message: 'Order created successfully',
            orderId,
            totalAmount,
            items: resolvedItems
        });
    } catch(error) {
        await conn.rollback();
        return resp.status(500).json({
            message: error.message
        });
    } finally {
        conn.release();
    }
}

async function getMyOrders(req, resp) {
    const [orders] = await pool.query(`
        SELECT id, total_amount, shipping_address, created_at, payment_status, status
        FROM orders
        WHERE user_id = ?`, [req.user.id]
    );
    return resp.status(200).json({
        orders
    });
}

async function getOrderById(req, resp) {
    const [orderRows] = await pool.query(`
        SELECT o.*, u.name AS user_name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?`, [req.params.id]
    );

    if(!orderRows.length) {
        return resp.status(404).json({
            message: 'Order not found'
        });
    }

    const order = orderRows[0];
    if(req.user.role !== 'admin' && order.user_id !== req.user.id) {
        return resp.status(403).json({
            message: 'Forbidden'
        });
    }

    const [orderItems] = await pool.query(`
        SELECT oi.*, p.name AS product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`, [order.id]
    );

    return resp.status(200).json({
        order,
        items: orderItems
    });

}

async function updateOrderStatus(req, resp) {
    const { status } = req.body;
    await pool.query(`
        UPDATE orders SET status = ? WHERE id = ?`, [status, req.params.id]
    );

    return resp.json({
        message: 'Order status updated'
    })
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
}