const User = require('../models/User');
const Design = require('../models/Design');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const logger = require('../middleware/logger');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('subscription')
      .populate('artisanProfile');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'preferences'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    logger.info('Profile updated', { userId: user._id });

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload an image'
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: req.file.path },
        { new: true }
      ).select('-password');

      res.json({
        status: 'success',
        data: { 
          user,
          message: 'Profile picture updated successfully'
        }
      });
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const [designCount, bookmarkCount, notificationCount] = await Promise.all([
      Design.countDocuments({ user: userId }),
      Bookmark.countDocuments({ user: userId }),
      Notification.countDocuments({ recipient: userId, read: false })
    ]);

    res.json({
      status: 'success',
      data: {
        designCount,
        bookmarkCount,
        notificationCount,
        generationCount: req.user.generationCount
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user's designs
exports.getUserDesigns = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const designs = await Design.find({ user: userId })
      .populate('pattern', 'name category')
      .populate('material', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments({ user: userId });

    res.json({
      status: 'success',
      data: {
        designs,
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

// Get user's bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('target')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments({ user: req.user.id });

    res.json({
      status: 'success',
      data: {
        bookmarks,
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

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check password
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide your password to confirm deletion'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid password'
      });
    }

    // Delete user data
    await user.deleteOne();

    logger.info('Account deleted', { userId: user._id });

    res.json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};