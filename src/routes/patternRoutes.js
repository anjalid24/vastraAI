const express = require('express');
const router = express.Router();
const {
  getAllPatterns,
  getPattern,
  createPattern,
  updatePattern,
  deletePattern,
  getCategories,
  getPatternStats
} = require('../controllers/patternController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllPatterns);
router.get('/categories', getCategories);
router.get('/:id', getPattern);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));
router.post('/', createPattern);
router.put('/:id', updatePattern);
router.delete('/:id', deletePattern);
router.get('/stats', getPatternStats);

module.exports = router;