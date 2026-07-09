const express = require('express');
const {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

const router = express.Router();

// ── Public reads ──────────────────────────────────────────
router.get('/', getMaterials);
router.get('/:id', getMaterialById);

// ── Protected writes (Brand or Admin) ─────────────────────
// Artisans browse materials but do not manage the catalogue.
router.post('/', protect, authorize(ROLES.BRAND, ROLES.ADMIN), createMaterial);
router.put('/:id', protect, authorize(ROLES.BRAND, ROLES.ADMIN), updateMaterial);
router.delete('/:id', protect, authorize(ROLES.BRAND, ROLES.ADMIN), deleteMaterial);

module.exports = router;
