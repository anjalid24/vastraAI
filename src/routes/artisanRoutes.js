const express = require('express');
const router = express.Router();
const {
  getAllArtisans,
  getArtisan,
  createArtisanProfile,
  updateArtisanProfile,
  addPortfolio,
  removePortfolio,
  verifyArtisan
} = require('../controllers/artisanController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllArtisans);
router.get('/:id', getArtisan);

// Protected routes
router.use(protect);
router.post('/profile', createArtisanProfile);
router.put('/profile', updateArtisanProfile);
router.post('/portfolio', addPortfolio);
router.delete('/portfolio/:portfolioId', removePortfolio);

// Admin only
router.put('/:id/verify', authorize('admin'), verifyArtisan);

module.exports = router;