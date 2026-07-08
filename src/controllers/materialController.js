const Material = require('../models/Material');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/roles');

/**
 * @desc    Create a material
 * @route   POST /api/materials
 * @access  Private (Brand, Artisan, Admin)
 */
const createMaterial = asyncHandler(async (req, res) => {
  const material = await Material.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: material });
});

/**
 * @desc    Get all materials (optionally filter by type)
 * @route   GET /api/materials
 * @access  Public
 */
const getMaterials = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;

  const materials = await Material.find(filter)
    .populate('supplier', 'name craft')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: materials.length, data: materials });
});

/**
 * @desc    Get a single material
 * @route   GET /api/materials/:id
 * @access  Public
 */
const getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id).populate('supplier', 'name craft');
  if (!material) {
    return res.status(404).json({ success: false, message: 'Material not found' });
  }
  return res.json({ success: true, data: material });
});

/**
 * @desc    Update a material
 * @route   PUT /api/materials/:id
 * @access  Private (owner, Admin)
 */
const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ success: false, message: 'Material not found' });
  }

  const isOwner = material.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to update this material' });
  }

  const payload = { ...req.body };
  delete payload.createdBy;
  Object.assign(material, payload);

  const updated = await material.save();
  return res.json({ success: true, data: updated });
});

/**
 * @desc    Delete a material
 * @route   DELETE /api/materials/:id
 * @access  Private (owner, Admin)
 */
const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ success: false, message: 'Material not found' });
  }

  const isOwner = material.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to delete this material' });
  }

  await material.deleteOne();
  return res.json({ success: true, message: 'Material removed' });
});

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
