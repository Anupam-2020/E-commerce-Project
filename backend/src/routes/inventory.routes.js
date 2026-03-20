const express = require('express');
const { getInventory, updateInventory } = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth.middlware');
const { allowedRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/:productId', protect, allowedRoles('admin'), getInventory);
router.patch('/:productId', protect, allowedRoles('admin'), updateInventory);

module.exports = router;