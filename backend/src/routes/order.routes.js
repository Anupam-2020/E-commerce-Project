const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middlware');
const { allowedRoles } = require('../middleware/role.middleware');

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, allowedRoles('admin'), updateOrderStatus);
module.exports = router;