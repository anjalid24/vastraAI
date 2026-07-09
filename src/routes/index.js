const express = require('express');
const authRoutes = require('./authRoutes');
const materialRoutes = require('./materialRoutes');

const router = express.Router();

// Feature routers are mounted here. New modules are added alongside auth.
router.use('/auth', authRoutes);
router.use('/materials', materialRoutes);

module.exports = router;
