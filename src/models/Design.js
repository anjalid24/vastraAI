const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  prompt: {
    type: String,
    required: true
  },
  negativePrompt: {
    type: String
  },
  referenceImage: {
    type: String
  },
  generatedImage: {
    type: String,
    required: true
  },
  seed: {
    type: Number
  },
  steps: {
    type: Number,
    default: 50
  },
  cfg: {
    type: Number,
    default: 7
  },
  width: {
    type: Number,
    default: 1024
  },
  height: {
    type: Number,
    default: 1024
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  authenticityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  authenticityDetails: {
    region: String,
    traditionalColors: Boolean,
    traditionalMotifs: Boolean,
    recommendedFabric: String,
    historicalContext: String,
    culturalAccuracy: Number
  },
  isCommercial: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [String],
  generationTime: {
    type: Number
  },
  metadata: {
    modelUsed: String,
    loraUsed: [String],
    sampler: String,
    scheduler: String
  },
  aiModel: {
    type: String,
    default: 'stable-diffusion-v2'
  }
}, {
  timestamps: true
});

// Indexes for performance
designSchema.index({ user: 1, createdAt: -1 });
designSchema.index({ pattern: 1 });
designSchema.index({ material: 1 });
designSchema.index({ isPublic: 1 });
designSchema.index({ authenticityScore: -1 });

module.exports = mongoose.model('Design', designSchema);