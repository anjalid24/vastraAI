const TextileEncyclopedia = require('../models/TextileEncyclopedia');
const logger = require('../middleware/logger');

// Get all encyclopedia entries
exports.getAllEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const entries = await TextileEncyclopedia.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await TextileEncyclopedia.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        entries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single encyclopedia entry
exports.getEntry = async (req, res) => {
  try {
    const entry = await TextileEncyclopedia.findById(req.params.id)
      .populate('relatedEntries', 'name category');

    if (!entry) {
      return res.status(404).json({
        status: 'error',
        message: 'Encyclopedia entry not found'
      });
    }

    // Increment view count
    entry.views += 1;
    await entry.save();

    res.status(200).json({
      status: 'success',
      data: { entry }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create encyclopedia entry (Admin only)
exports.createEntry = async (req, res) => {
  try {
    const entry = await TextileEncyclopedia.create(req.body);
    logger.info('Encyclopedia entry created', { entryId: entry._id, name: entry.name });
    res.status(201).json({
      status: 'success',
      data: { entry }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update encyclopedia entry (Admin only)
exports.updateEntry = async (req, res) => {
  try {
    const entry = await TextileEncyclopedia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        status: 'error',
        message: 'Encyclopedia entry not found'
      });
    }

    logger.info('Encyclopedia entry updated', { entryId: entry._id });
    res.status(200).json({
      status: 'success',
      data: { entry }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete encyclopedia entry (Admin only)
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await TextileEncyclopedia.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({
        status: 'error',
        message: 'Encyclopedia entry not found'
      });
    }

    logger.info('Encyclopedia entry deleted', { entryId: entry._id });
    res.status(200).json({
      status: 'success',
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get entries by region
exports.getEntriesByRegion = async (req, res) => {
  try {
    const { state } = req.params;
    const entries = await TextileEncyclopedia.find({
      'origin.state': state
    }).sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: { entries }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get entries by craft type
exports.getEntriesByCraft = async (req, res) => {
  try {
    const { craft } = req.params;
    const entries = await TextileEncyclopedia.find({
      category: craft
    }).sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: { entries }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};