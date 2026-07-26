const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getCategories,
  getRecommendedForPattern
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllMaterials);
router.get('/categories', getCategories);
router.get('/pattern/:patternId', getRecommendedForPattern);
router.get('/:id', getMaterial);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;