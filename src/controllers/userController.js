const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ROLE_VALUES } = require('../config/roles');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

/**
 * @desc    Get a single user by id
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, data: user });
});

/**
 * @desc    Update a user (role, active status, name)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { name, role, isActive } = req.body;
  if (name !== undefined) user.name = name;
  if (role !== undefined && ROLE_VALUES.includes(role)) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  const updated = await user.save();
  return res.json({
    success: true,
    data: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    },
  });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  await user.deleteOne();
  return res.json({ success: true, message: 'User removed' });
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
