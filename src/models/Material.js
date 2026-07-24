const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide material name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cotton', 'silk', 'wool', 'linen', 'polyester', 'blend', 'georgette', 'chiffon']
  },
  description: {
    type: String,
    required: true
  },
  texture: {
    type: String,
    required: true
  },
  gsm: {
    type: Number,
    min: 0
  },
  width: {
    type: Number,
    min: 0
  },
  pricePerMeter: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    location: String
  },
  recommendedPatterns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'
  }],
  availability: {
    type: Boolean,
    default: true
  },
  colors: [{
    name: String,
    hexCode: String
  }],
  origin: {
    state: String,
    city: String,
    country: String
  },
  careInstructions: [String],
  images: [String],
  certifications: [String],
  sustainabilityScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for search functionality
materialSchema.index({ name: 'text', description: 'text' });
materialSchema.index({ category: 1 });
materialSchema.index({ sustainabilityScore: -1 });

module.exports = mongoose.model('Material', materialSchema);