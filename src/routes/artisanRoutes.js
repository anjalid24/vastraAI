const express = require('express');
const {
  createArtisan,
  getArtisans,
  getArtisanById,
  updateArtisan,
  deleteArtisan,
} = require('../controllers/artisanController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

const router = express.Router();

router
  .route('/')
  .get(getArtisans)
  .post(protect, authorize(ROLES.ARTISAN, ROLES.ADMIN), createArtisan);

router
  .route('/:id')
  .get(getArtisanById)
  .put(protect, authorize(ROLES.ARTISAN, ROLES.ADMIN), updateArtisan)
  .delete(protect, authorize(ROLES.ARTISAN, ROLES.ADMIN), deleteArtisan);

module.exports = router;
