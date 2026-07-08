const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const artisanRoutes = require('./artisanRoutes');
const materialRoutes = require('./materialRoutes');
const designRoutes = require('./designRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/artisans', artisanRoutes);
router.use('/materials', materialRoutes);
router.use('/designs', designRoutes);

module.exports = router;
