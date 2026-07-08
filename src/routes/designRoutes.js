const express = require('express');
const {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
} = require('../controllers/designController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

const router = express.Router();

router
  .route('/')
  .get(getDesigns)
  .post(protect, authorize(ROLES.BRAND, ROLES.ADMIN), createDesign);

router
  .route('/:id')
  .get(getDesignById)
  .put(protect, authorize(ROLES.BRAND, ROLES.ADMIN), updateDesign)
  .delete(protect, authorize(ROLES.BRAND, ROLES.ADMIN), deleteDesign);

module.exports = router;
