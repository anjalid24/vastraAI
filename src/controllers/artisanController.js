const Artisan = require('../models/Artisan');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/roles');

/**
 * @desc    Create an artisan profile
 * @route   POST /api/artisans
 * @access  Private (Artisan, Admin)
 */
const createArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: artisan });
});

/**
 * @desc    Get all artisans
 * @route   GET /api/artisans
 * @access  Public
 */
const getArtisans = asyncHandler(async (req, res) => {
  const artisans = await Artisan.find().populate('user', 'name email role');
  res.json({ success: true, count: artisans.length, data: artisans });
});

/**
 * @desc    Get a single artisan
 * @route   GET /api/artisans/:id
 * @access  Public
 */
const getArtisanById = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id).populate('user', 'name email role');
  if (!artisan) {
    return res.status(404).json({ success: false, message: 'Artisan not found' });
  }
  return res.json({ success: true, data: artisan });
});

/**
 * @desc    Update an artisan profile
 * @route   PUT /api/artisans/:id
 * @access  Private (owner Artisan, Admin)
 */
const updateArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) {
    return res.status(404).json({ success: false, message: 'Artisan not found' });
  }

  const isOwner = artisan.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to update this profile' });
  }

  // "verified" may only be set by admins.
  const payload = { ...req.body };
  if (req.user.role !== ROLES.ADMIN) delete payload.verified;
  delete payload.user; // never reassign ownership through this route

  Object.assign(artisan, payload);
  const updated = await artisan.save();
  return res.json({ success: true, data: updated });
});

/**
 * @desc    Delete an artisan profile
 * @route   DELETE /api/artisans/:id
 * @access  Private (owner Artisan, Admin)
 */
const deleteArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) {
    return res.status(404).json({ success: false, message: 'Artisan not found' });
  }

  const isOwner = artisan.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to delete this profile' });
  }

  await artisan.deleteOne();
  return res.json({ success: true, message: 'Artisan removed' });
});

module.exports = {
  createArtisan,
  getArtisans,
  getArtisanById,
  updateArtisan,
  deleteArtisan,
};
