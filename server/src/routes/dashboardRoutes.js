const express = require('express');
const {
  getStudentDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/student', protect, getStudentDashboard);
router.get('/admin', protect, requireAdmin, getAdminDashboard);

module.exports = router;
