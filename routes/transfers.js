const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { addTransfer, getTransfers } = require('../controllers/transferController');

router.post('/', authorize(['admin', 'logistics']), addTransfer);
router.get('/', authorize(['admin', 'commander', 'logistics']), getTransfers);

module.exports = router;
