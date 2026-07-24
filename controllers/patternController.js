const Pattern = require('../models/Pattern');
const Design = require('../models/Design');
const logger = require('../middleware/logger');

// Get all patterns
exports.getAllPatterns = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const patterns = await Pattern.find(filter)
      .populate('recommendedMaterials', 'name pricePerMeter images');

    res.json({
      status: 'success',
      data: { patterns }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single pattern
exports.getPattern = async (req, res) => {
  try {
    const pattern = await Pattern.findById(req.params.id)
      .populate('recommendedMaterials', 'name pricePerMeter images');

    if (!pattern) {
      return res.status(404).json({
        status: 'error',
        message: 'Pattern not found'
      });
    }

    // Get related designs
    const relatedDesigns = await Design.find({ pattern: pattern._id })
      .limit(5)
      .select('generatedImage createdAt');

    res.json({
      status: 'success',
      data: { 
        pattern,
        relatedDesigns
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create pattern (Admin only)
exports.createPattern = async (req, res) => {
  try {
    const pattern = await Pattern.create(req.body);
    logger.info('Pattern created', { patternId: pattern._id, name: pattern.name });
    res.status(201).json({
      status: 'success',
      data: { pattern }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update pattern (Admin only)
exports.updatePattern = async (req, res) => {
  try {
    const pattern = await Pattern.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pattern) {
      return res.status(404).json({
        status: 'error',
        message: 'Pattern not found'
      });
    }

    logger.info('Pattern updated', { patternId: pattern._id });
    res.json({
      status: 'success',
      data: { pattern }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete pattern (Admin only)
exports.deletePattern = async (req, res) => {
  try {
    const pattern = await Pattern.findByIdAndDelete(req.params.id);

    if (!pattern) {
      return res.status(404).json({
        status: 'error',
        message: 'Pattern not found'
      });
    }

    logger.info('Pattern deleted', { patternId: pattern._id });
    res.json({
      status: 'success',
      message: 'Pattern deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get pattern categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Pattern.distinct('category');
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

// Get pattern statistics (Admin only)
exports.getPatternStats = async (req, res) => {
  try {
    const totalPatterns = await Pattern.countDocuments();
    const activePatterns = await Pattern.countDocuments({ isActive: true });
    const categories = await Pattern.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      status: 'success',
      data: {
        totalPatterns,
        activePatterns,
        categories
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};