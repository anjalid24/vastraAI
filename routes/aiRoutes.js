const express = require('express');
const router = express.Router();
const {
  generateWithAI,
  getAICapabilities,
  getGenerationStatus
} = require('../controllers/aiController');
const { protect, checkGenerationLimit } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// Protected routes
router.use(protect);

// AI generation
router.post('/generate', aiLimiter, checkGenerationLimit, generateWithAI);
router.get('/capabilities', getAICapabilities);
router.get('/status/:id', getGenerationStatus);

module.exports = router;