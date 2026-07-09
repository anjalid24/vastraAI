const Material = require('../models/Material');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/roles');

// Fields a client is allowed to set/update. createdBy and timestamps are
// managed by the server, never taken from the request body.
const WRITABLE_FIELDS = [
  'materialName',
  'category',
  'description',
  'pricePerMeter',
  'stockQuantity',
  'colorOptions',
  'imageUrl',
  'supplierName',
  'countryOfOrigin',
  'sustainabilityRating',
  'isAvailable',
];

// Pick only the whitelisted fields from a request body.
const pickWritable = (body = {}) =>
  WRITABLE_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

/**
 * @desc    Create a new material
 * @route   POST /api/materials
 * @access  Private (Brand, Admin)
 */
const createMaterial = asyncHandler(async (req, res) => {
  const payload = pickWritable(req.body);
  // Ownership is taken from the authenticated user, not the request body.
  payload.createdBy = req.user._id;

  // Mongoose schema validation (required fields, min/enum, etc.) runs here
  // and any error is normalized by the centralized error handler.
  const material = await Material.create(payload);

  res.status(201).json({
    success: true,
    message: 'Material created successfully',
    data: { material },
  });
});

/**
 * @desc    Get all materials (supports basic filtering & pagination)
 * @route   GET /api/materials
 * @access  Public
 * @query   category, isAvailable, search, page, limit
 */
const getMaterials = asyncHandler(async (req, res) => {
  const { category, isAvailable, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
  if (search) filter.materialName = { $regex: search.trim(), $options: 'i' };

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [materials, total] = await Promise.all([
    Material.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Material.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: materials.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: { materials },
  });
});

/**
 * @desc    Get a single material by id
 * @route   GET /api/materials/:id
 * @access  Public
 */
const getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id).populate(
    'createdBy',
    'name email role'
  );
  if (!material) {
    throw new ApiError(404, 'Material not found');
  }
  res.status(200).json({ success: true, data: { material } });
});

// Allow the change only if the requester owns the material or is an admin.
const assertCanModify = (material, user) => {
  const isOwner = material.createdBy.toString() === user._id.toString();
  if (!isOwner && user.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'You are not allowed to modify this material');
  }
};

/**
 * @desc    Update a material
 * @route   PUT /api/materials/:id
 * @access  Private (owner Brand, Admin)
 */
const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    throw new ApiError(404, 'Material not found');
  }

  assertCanModify(material, req.user);

  Object.assign(material, pickWritable(req.body));
  // runValidators fire on save() by default for modified paths.
  const updated = await material.save();

  res.status(200).json({
    success: true,
    message: 'Material updated successfully',
    data: { material: updated },
  });
});

/**
 * @desc    Delete a material
 * @route   DELETE /api/materials/:id
 * @access  Private (owner Brand, Admin)
 */
const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    throw new ApiError(404, 'Material not found');
  }

  assertCanModify(material, req.user);

  await material.deleteOne();

  res.status(200).json({ success: true, message: 'Material deleted successfully' });
});

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
