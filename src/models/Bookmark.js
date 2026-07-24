const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['post', 'design', 'pattern', 'artisan', 'encyclopedia'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['CommunityPost', 'Design', 'Pattern', 'Artisan', 'TextileEncyclopedia']
  },
  notes: {
    type: String,
    maxlength: 500
  },
  collection: {
    type: String,
    default: 'default'
  }
}, {
  timestamps: true
});

// Ensure one bookmark per user per target
bookmarkSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, collection: 1 });

// Virtual for getting the target object
bookmarkSchema.virtual('target', {
  ref: 'targetModel',
  localField: 'targetId',
  foreignField: '_id',
  justOne: true
});

bookmarkSchema.set('toJSON', { virtuals: true });
bookmarkSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);