const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['post', 'comment', 'design'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['CommunityPost', 'Comment', 'Design']
  }
}, {
  timestamps: true
});

// Ensure one like per user per target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
likeSchema.index({ targetType: 1, targetId: 1 });

// Virtual for getting the target object
likeSchema.virtual('target', {
  ref: 'targetModel',
  localField: 'targetId',
  foreignField: '_id',
  justOne: true
});

likeSchema.set('toJSON', { virtuals: true });
likeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Like', likeSchema);