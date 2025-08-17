const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { addPurchase, getPurchases } = require('../controllers/purchaseController');

router.post('/', authorize(['admin', 'logistics']), addPurchase);
router.get('/', authorize(['admin', 'logistics', 'commander']), getPurchases);

module.exports = router;
