const Material = require('../models/Material');
const Design = require('../models/Design');
const logger = require('../middleware/logger');

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { availability: true };

    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const materials = await Material.find(filter)
      .populate('recommendedPatterns', 'name category');

    res.json({
      status: 'success',
      data: { materials }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single material
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('recommendedPatterns', 'name category sampleImages');

    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material not found'
      });
    }

    res.json({
      status: 'success',
      data: { material }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create material (Admin only)
exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create(req.body);
    logger.info('Material created', { materialId: material._id, name: material.name });
    res.status(201).json({
      status: 'success',
      data: { material }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update material (Admin only)
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material not found'
      });
    }

    logger.info('Material updated', { materialId: material._id });
    res.json({
      status: 'success',
      data: { material }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete material (Admin only)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material not found'
      });
    }

    logger.info('Material deleted', { materialId: material._id });
    res.json({
      status: 'success',
      message: 'Material deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get material categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Material.distinct('category');
    res.json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get materials by pattern recommendation
exports.getRecommendedForPattern = async (req, res) => {
  try {
    const { patternId } = req.params;
    const materials = await Material.find({
      recommendedPatterns: patternId,
      availability: true
    });

    res.json({
      status: 'success',
      data: { materials }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};