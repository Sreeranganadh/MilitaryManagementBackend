const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authMiddleware');
const {
  assignAsset,
  getAssignments,
  expendAsset
} = require('../controllers/assignmentController');

router.post('/', authorize(['admin', 'commander']), assignAsset);
router.get('/', authorize(['admin', 'commander', 'logistics']), getAssignments);
router.post('/expend', authorize(['admin', 'commander']), expendAsset);

module.exports = router;
