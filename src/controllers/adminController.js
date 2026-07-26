const User = require('../models/User');
const Design = require('../models/Design');
const Pattern = require('../models/Pattern');
const Material = require('../models/Material');
const Artisan = require('../models/Artisan');
const CommunityPost = require('../models/CommunityPost');
const Report = require('../models/Report');
const Subscription = require('../models/Subscription');
const logger = require('../middleware/logger');

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDesigns,
      totalPatterns,
      totalMaterials,
      totalArtisans,
      totalPosts,
      pendingReports
    ] = await Promise.all([
      User.countDocuments(),
      Design.countDocuments(),
      Pattern.countDocuments(),
      Material.countDocuments(),
      Artisan.countDocuments(),
      CommunityPost.countDocuments(),
      Report.countDocuments({ status: 'pending' })
    ]);

    // Get recent activity
    const recentDesigns = await Design.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('name email createdAt role')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalDesigns,
          totalPatterns,
          totalMaterials,
          totalArtisans,
          totalPosts,
          pendingReports
        },
        recentActivity: {
          recentDesigns,
          recentUsers
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

// Get all users (with filters)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('subscription')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        users,
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

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive, subscription } = req.body;
    const updateData = {};

    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (subscription) updateData.subscription = subscription;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    logger.info('User updated by admin', { userId: user._id, adminId: req.user.id });
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

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Delete associated data
    await Design.deleteMany({ user: user._id });
    await Artisan.deleteMany({ user: user._id });
    await Subscription.deleteMany({ user: user._id });

    logger.info('User deleted by admin', { userId: user._id, adminId: req.user.id });
    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        reports,
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

// Resolve report (Admin only)
exports.resolveReport = async (req, res) => {
  try {
    const { action, notes } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolution: {
          action,
          notes,
          resolvedBy: req.user.id,
          resolvedAt: new Date()
        },
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    // Take action on reported content
    if (action === 'content_removed') {
      const model = require(`../models/${report.targetModel}`);
      await model.findByIdAndDelete(report.targetId);
    }

    logger.info('Report resolved by admin', { reportId: report._id, adminId: req.user.id });
    res.json({
      status: 'success',
      data: { report }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      userGrowth,
      designGrowth,
      popularPatterns,
      popularMaterials
    ] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Design.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Design.aggregate([
        { $group: { _id: '$pattern', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'patterns', localField: '_id', foreignField: '_id', as: 'pattern' } },
        { $unwind: '$pattern' }
      ]),
      Design.aggregate([
        { $group: { _id: '$material', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'materials', localField: '_id', foreignField: '_id', as: 'material' } },
        { $unwind: '$material' }
      ])
    ]);

    res.json({
      status: 'success',
      data: {
        userGrowth,
        designGrowth,
        popularPatterns: popularPatterns.map(p => ({ pattern: p.pattern.name, count: p.count })),
        popularMaterials: popularMaterials.map(p => ({ material: p.material.name, count: p.count }))
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// System settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    // Implement settings update logic
    // This could update a SystemSettings collection
    res.json({
      status: 'success',
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};