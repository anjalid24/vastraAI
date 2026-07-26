const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const Report = require('../models/Report');
const logger = require('../middleware/logger');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, sort, search } = req.query;

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { viewCount: -1 };
    if (sort === 'trending') sortOption = { 'likes.length': -1 };

    const posts = await CommunityPost.find(filter)
      .populate('user', 'name profilePicture')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await CommunityPost.countDocuments(filter);

    // Get like/comment counts
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const postObj = post.toObject();
      postObj.commentCount = await Comment.countDocuments({ post: post._id });
      postObj.likeCount = await Like.countDocuments({
        targetType: 'post',
        targetId: post._id
      });
      return postObj;
    }));

    res.json({
      status: 'success',
      data: {
        posts: postsWithCounts,
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

// Create post
exports.createPost = async (req, res) => {
  try {
    const post = await CommunityPost.create({
      ...req.body,
      user: req.user.id
    });

    logger.info('Community post created', { postId: post._id, userId: req.user.id });

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('user', 'name profilePicture');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    // Get comments with user data
    const comments = await Comment.find({ post: post._id, parentComment: null })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Get replies
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('user', 'name profilePicture')
        .sort({ createdAt: 1 });
      
      return { ...comment.toObject(), replies };
    }));

    res.json({
      status: 'success',
      data: {
        post,
        comments: commentsWithReplies
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this post'
      });
    }

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: { post: updatedPost }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this post'
      });
    }

    // Delete all comments and likes
    await Comment.deleteMany({ post: post._id });
    await Like.deleteMany({ targetType: 'post', targetId: post._id });
    await post.deleteOne();

    logger.info('Community post deleted', { postId: post._id });

    res.json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({
      user: userId,
      targetType,
      targetId,
      targetModel: targetType === 'post' ? 'CommunityPost' : 'Comment'
    });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({
        status: 'success',
        data: { liked: false }
      });
    }

    await Like.create({
      user: userId,
      targetType,
      targetId,
      targetModel: targetType === 'post' ? 'CommunityPost' : 'Comment'
    });

    res.json({
      status: 'success',
      data: { liked: true }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Bookmark/Unbookmark post
exports.toggleBookmark = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      targetType,
      targetId
    });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      return res.json({
        status: 'success',
        data: { bookmarked: false }
      });
    }

    await Bookmark.create({
      user: userId,
      targetType,
      targetId,
      targetModel: targetType === 'post' ? 'CommunityPost' : 
                   targetType === 'design' ? 'Design' : 
                   targetType === 'pattern' ? 'Pattern' : 'Artisan'
    });

    res.json({
      status: 'success',
      data: { bookmarked: true }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Report content
exports.reportContent = async (req, res) => {
  try {
    const { targetType, targetId, reason, description, evidence } = req.body;

    const report = await Report.create({
      reporter: req.user.id,
      targetType,
      targetId,
      targetModel: targetType === 'post' ? 'CommunityPost' :
                   targetType === 'comment' ? 'Comment' :
                   targetType === 'user' ? 'User' :
                   targetType === 'design' ? 'Design' : 'Artisan',
      reason,
      description,
      evidence: evidence || []
    });

    logger.info('Content reported', { reportId: report._id, userId: req.user.id });

    res.status(201).json({
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

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: postId, parentComment: null });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('user', 'name profilePicture')
        .sort({ createdAt: 1 });
      
      return { ...comment.toObject(), replies };
    }));

    res.json({
      status: 'success',
      data: {
        comments: commentsWithReplies,
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