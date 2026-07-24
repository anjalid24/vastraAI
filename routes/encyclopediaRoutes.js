const express = require('express');
const router = express.Router();
const {
  getAllEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  getEntriesByRegion,
  getEntriesByCraft
} = require('../controllers/encyclopediaController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllEntries);
router.get('/region/:state', getEntriesByRegion);
router.get('/craft/:craft', getEntriesByCraft);
router.get('/:id', getEntry);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;