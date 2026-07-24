const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getReports,
  resolveReport,
  getAnalytics,
  updateSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Report management
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

// Settings
router.put('/settings', updateSettings);

module.exports = router;