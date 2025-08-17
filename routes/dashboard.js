const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

router.get('/', authorize(['admin', 'commander', 'logistics']), getDashboardStats);

module.exports = router;
