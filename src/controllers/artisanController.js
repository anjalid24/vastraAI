const Artisan = require('../models/Artisan');
const User = require('../models/User');
const logger = require('../middleware/logger');

// Get all artisans
exports.getAllArtisans = async (req, res) => {
  try {
    const { state, craft, search, minRating } = req.query;
    const filter = {};

    if (state) filter.state = state;
    if (craft) filter.craft = craft;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { craft: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const artisans = await Artisan.find(filter)
      .populate('user', 'name email profilePicture')
      .sort({ rating: -1 });

    res.json({
      status: 'success',
      data: { artisans }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single artisan
exports.getArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id)
      .populate('user', 'name email profilePicture');

    if (!artisan) {
      return res.status(404).json({
        status: 'error',
        message: 'Artisan not found'
      });
    }

    res.json({
      status: 'success',
      data: { artisan }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create artisan profile
exports.createArtisanProfile = async (req, res) => {
  try {
    // Check if user already has artisan profile
    const existing = await Artisan.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'You already have an artisan profile'
      });
    }

    const artisan = await Artisan.create({
      ...req.body,
      user: req.user.id,
      name: req.body.name || req.user.name
    });

    // Update user role
    await User.findByIdAndUpdate(req.user.id, {
      role: 'artisan',
      artisanProfile: artisan._id
    });

    logger.info('Artisan profile created', { userId: req.user.id, artisanId: artisan._id });

    res.status(201).json({
      status: 'success',
      data: { artisan }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update artisan profile
exports.updateArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ user: req.user.id });

    if (!artisan) {
      return res.status(404).json({
        status: 'error',
        message: 'Artisan profile not found'
      });
    }

    // Check if user owns the profile
    if (artisan.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this profile'
      });
    }

    const updatedArtisan = await Artisan.findByIdAndUpdate(
      artisan._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: { artisan: updatedArtisan }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add portfolio item
exports.addPortfolio = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ user: req.user.id });

    if (!artisan) {
      return res.status(404).json({
        status: 'error',
        message: 'Artisan profile not found'
      });
    }

    artisan.portfolio.push(req.body);
    await artisan.save();

    res.json({
      status: 'success',
      data: { portfolio: artisan.portfolio }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Remove portfolio item
exports.removePortfolio = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ user: req.user.id });

    if (!artisan) {
      return res.status(404).json({
        status: 'error',
        message: 'Artisan profile not found'
      });
    }

    artisan.portfolio = artisan.portfolio.filter(
      item => item._id.toString() !== req.params.portfolioId
    );
    await artisan.save();

    res.json({
      status: 'success',
      data: { portfolio: artisan.portfolio }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Verify artisan (Admin only)
exports.verifyArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!artisan) {
      return res.status(404).json({
        status: 'error',
        message: 'Artisan not found'
      });
    }

    logger.info('Artisan verified', { artisanId: artisan._id });
    res.json({
      status: 'success',
      data: { artisan }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};