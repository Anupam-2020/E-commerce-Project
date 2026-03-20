const express = require('express');
const { createPayment, getPaymentByOrder, updatePaymentStatus } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middlware');
const { allowedRoles } = require('../middleware/role.middleware');

const router = express.Router();
router.post('/', protect, createPayment);
router.get('/order/:orderId', protect, getPaymentByOrder);
router.patch('/:id/status', protect, allowedRoles('admin'), updatePaymentStatus);

module.exports = router;