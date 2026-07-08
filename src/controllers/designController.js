const Design = require('../models/Design');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/roles');

/**
 * @desc    Create a design
 * @route   POST /api/designs
 * @access  Private (Brand, Admin)
 */
const createDesign = asyncHandler(async (req, res) => {
  const design = await Design.create({ ...req.body, brand: req.user._id });
  res.status(201).json({ success: true, data: design });
});

/**
 * @desc    Get all designs (optionally filter by status/category)
 * @route   GET /api/designs
 * @access  Public
 */
const getDesigns = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const designs = await Design.find(filter)
    .populate('brand', 'name email')
    .populate('artisan', 'name craft')
    .populate('materials', 'name type')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: designs.length, data: designs });
});

/**
 * @desc    Get a single design
 * @route   GET /api/designs/:id
 * @access  Public
 */
const getDesignById = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id)
    .populate('brand', 'name email')
    .populate('artisan', 'name craft')
    .populate('materials', 'name type');
  if (!design) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }
  return res.json({ success: true, data: design });
});

/**
 * @desc    Update a design
 * @route   PUT /api/designs/:id
 * @access  Private (owner Brand, Admin)
 */
const updateDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }

  const isOwner = design.brand.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to update this design' });
  }

  const payload = { ...req.body };
  delete payload.brand;
  Object.assign(design, payload);

  const updated = await design.save();
  return res.json({ success: true, data: updated });
});

/**
 * @desc    Delete a design
 * @route   DELETE /api/designs/:id
 * @access  Private (owner Brand, Admin)
 */
const deleteDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) {
    return res.status(404).json({ success: false, message: 'Design not found' });
  }

  const isOwner = design.brand.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'Not allowed to delete this design' });
  }

  await design.deleteOne();
  return res.json({ success: true, message: 'Design removed' });
});

module.exports = {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
};
