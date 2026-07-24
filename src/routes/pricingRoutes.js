const express = require('express');
const router = express.Router();
const {
  getAllRules,
  createRule,
  updateRule,
  deleteRule,
  calculatePrice,
  calculateShipping,
  calculateFullEstimate
} = require('../controllers/pricingController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (with authentication)
router.use(protect);

// Calculation endpoints
router.post('/calculate', calculatePrice);
router.post('/shipping', calculateShipping);
router.post('/estimate', calculateFullEstimate);

// Admin only routes
router.use(authorize('admin'));
router.get('/rules', getAllRules);
router.post('/rules', createRule);
router.put('/rules/:id', updateRule);
router.delete('/rules/:id', deleteRule);

module.exports = router;