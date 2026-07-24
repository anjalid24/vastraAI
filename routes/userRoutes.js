const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getUserStats,
  getUserDesigns,
  getBookmarks,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError, validateFileExists } = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.get('/profile/:id', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', uploadSingle, validateFileExists, handleUploadError, uploadProfilePicture);

// User data routes
router.get('/stats', getUserStats);
router.get('/designs', getUserDesigns);
router.get('/bookmarks', getBookmarks);

// Account management
router.delete('/account', deleteAccount);

module.exports = router;