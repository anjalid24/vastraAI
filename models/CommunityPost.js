const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  images: [String],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['design', 'technique', 'history', 'question', 'inspiration', 'showcase', 'discussion'],
    default: 'design'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
  relatedDesign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design'
  }
}, {
  timestamps: true
});

// Indexes
communityPostSchema.index({ title: 'text', description: 'text' });
communityPostSchema.index({ category: 1 });
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ 'likes.length': -1 });

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are included in JSON output
communityPostSchema.set('toJSON', { virtuals: true });
communityPostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);