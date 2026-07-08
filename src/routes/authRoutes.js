const express = require('express');
const { signup, login, getMe, adminOnly } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

const router = express.Router();

// ── Public ────────────────────────────────────────────────
router.post('/signup', signup);
router.post('/login', login);

// ── Protected (any authenticated user) ────────────────────
router.get('/me', protect, getMe);

// ── Protected + role-restricted (admin only) ──────────────
router.get('/admin', protect, authorize(ROLES.ADMIN), adminOnly);

module.exports = router;
