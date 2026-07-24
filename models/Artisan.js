const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  craft: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  pricing: {
    type: Number,
    required: true
  },
  pricingUnit: {
    type: String,
    enum: ['per_day', 'per_piece', 'per_project'],
    default: 'per_day'
  },
  portfolio: [{
    title: String,
    description: String,
    image: String,
    pattern: String,
    material: String,
    year: Number
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  specialties: [String],
  awards: [String],
  socialMedia: {
    instagram: String,
    facebook: String,
    youtube: String
  },
  contactEmail: String,
  contactPhone: String,
  languages: [String],
  workingHours: {
    start: String,
    end: String,
    days: [String]
  },
  deliveryAreas: [String],
  certifications: [String],
  gallery: [String],
  video: String
}, {
  timestamps: true
});

// Index for location-based search
artisanSchema.index({ state: 1, city: 1 });
artisanSchema.index({ craft: 1 });
artisanSchema.index({ rating: -1 });
artisanSchema.index({ verified: 1 });

module.exports = mongoose.model('Artisan', artisanSchema);