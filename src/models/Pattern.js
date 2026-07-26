const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide pattern name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ikat', 'bandhani', 'patola', 'ajrakh', 'kalamkari', 'chikankari', 'banarasi', 'kasavu', 'pochampally', 'paithani']
  },
  history: {
    type: String,
    required: true
  },
  origin: {
    state: String,
    city: String,
    country: String,
    region: String
  },
  description: {
    type: String,
    required: true
  },
  recommendedMaterials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  promptTemplate: {
    type: String,
    required: true
  },
  negativePrompt: {
    type: String
  },
  sampleImages: [String],
  traditionalColors: [{
    name: String,
    hexCode: String
  }],
  techniques: [String],
  tools: [String],
  timeRequired: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks'],
      default: 'hours'
    }
  },
  culturalSignificance: String,
  regions: [String],
  festivals: [String],
  loRAPath: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
patternSchema.index({ name: 'text', description: 'text', history: 'text' });
patternSchema.index({ category: 1 });
patternSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Pattern', patternSchema);