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

router
  .route('/')
  .get(getMaterials)
  .post(protect, authorize(ROLES.BRAND, ROLES.ARTISAN, ROLES.ADMIN), createMaterial);

router
  .route('/:id')
  .get(getMaterialById)
  .put(protect, authorize(ROLES.BRAND, ROLES.ARTISAN, ROLES.ADMIN), updateMaterial)
  .delete(protect, authorize(ROLES.BRAND, ROLES.ARTISAN, ROLES.ADMIN), deleteMaterial);

module.exports = router;
