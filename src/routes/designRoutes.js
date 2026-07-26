const express = require('express');
const router = express.Router();
const {
  generateDesign,
  getMyDesigns,
  getDesign,
  deleteDesign,
  regenerateDesign,
  downloadDesign,
  getPublicDesigns
} = require('../controllers/designController');
const { protect, checkGenerationLimit } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/public', getPublicDesigns);

// Protected routes
router.use(protect);
router.get('/my/designs', getMyDesigns);
router.post('/generate', aiLimiter, checkGenerationLimit, generateDesign);
router.post('/:id/regenerate', checkGenerationLimit, regenerateDesign);
router.get('/:id/download', downloadDesign);
router.get('/:id', getDesign);
router.delete('/:id', deleteDesign);

module.exports = router;