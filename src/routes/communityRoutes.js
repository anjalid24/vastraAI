const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  reportContent,
  getComments
} = require('../controllers/communityController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth)
router.get('/', optionalAuth, getAllPosts);
router.get('/:id', optionalAuth, getPost);
router.get('/:postId/comments', getComments);

// Protected routes
router.use(protect);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:targetType/:targetId/like', toggleLike);
router.post('/:targetType/:targetId/bookmark', toggleBookmark);
router.post('/report', reportContent);

module.exports = router;