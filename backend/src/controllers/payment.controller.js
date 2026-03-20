const pool = require('../config/db');

async function createPayment(req, resp) {
    const { order_id, payment_method, transaction_ref } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [orderRows] = await conn.query(`
            SELECT id, user_id, total_amount, payment_status FROM orders WHERE id = ? AND user_id = ? FOR UPDATE
        `, [order_id, req.user.id]
        );

        if(!orderRows.length) {
            throw new Error('Order not found');
        }

        const order = orderRows[0];

        if(req.user.role !== 'admin' && order.user_id !== req.user.id) {
            throw new Error('Forbidden');
        }

        if(order.payment_status === 'paid') {
            throw new Error('Order already paid');
        }

        const [result] = await conn.query(`
            INSERT INTO payments (order_id, payment_method, transaction_ref)
            VALUES (?, ?, ?)`, [order_id, payment_method, transaction_ref]
        );
        
        await conn.query(`
            UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?`, [order_id]
        );

        await conn.commit();
        return resp.status(201).json({
            message: 'Payment recorded and order confirmed',
            payment_Id: result.insertId
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

async function getPaymentByOrder(req, resp) {
    const [rows] = await pool.query(`
        SELECT * FROM payments WHERE order_id = ?`, [req.params.orderId]
    );

    return resp.json(rows);
}

async function updatePaymentStatus(req, resp) {
    const { status } = req.body;
    await pool.query(`
        UPDATE payments SET status = ? WHERE id = ?`, [status, req.params.id]
    );

    return resp.json({
        message: 'Payment status updated'
    });
}

module.exports = {
    createPayment,
    getPaymentByOrder,
    updatePaymentStatus
}