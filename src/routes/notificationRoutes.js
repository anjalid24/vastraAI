const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// All notification routes require authentication
router.use(protect);

// Get notifications
router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);

// Mark as read
router.put('/:id/read', markAsRead);
router.put('/read/all', markAllAsRead);

// Delete notifications
router.delete('/:id', deleteNotification);
router.delete('/all', deleteAllNotifications);

module.exports = router;