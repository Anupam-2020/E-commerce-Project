const express = require('express');
const { listProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middlware');
const { allowedRoles } = require('../middleware/role.middleware');

const router = express.Router();
router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', protect, allowedRoles('admin'), createProduct);
router.put('/:id', protect, allowedRoles('admin'), updateProduct);
router.delete('/:id', protect, allowedRoles('admin'), deleteProduct);

module.exports = router;