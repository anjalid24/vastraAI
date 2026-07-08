const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Feature routers are mounted here. Only auth exists for now; future
// modules (users, artisans, designs, ...) will be added alongside it.
router.use('/auth', authRoutes);

module.exports = router;
