const mongoose = require('mongoose');

const textileEncyclopediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an entry name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['pattern', 'technique', 'material', 'region', 'craft', 'festival']
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
  timeline: [{
    year: String,
    event: String,
    description: String
  }],
  technique: {
    type: String
  },
  gallery: [{
    url: String,
    caption: String,
    credit: String
  }],
  videos: [{
    url: String,
    title: String,
    platform: {
      type: String,
      enum: ['youtube', 'vimeo', 'other']
    }
  }],
  materials: [{
    name: String,
    description: String,
    image: String
  }],
  traditionalColors: [{
    name: String,
    hexCode: String,
    description: String
  }],
  interestingFacts: [{
    fact: String,
    source: String
  }],
  references: [{
    title: String,
    author: String,
    year: Number,
    url: String,
    source: String
  }],
  map: {
    latitude: Number,
    longitude: Number,
    zoom: Number
  },
  culturalSignificance: String,
  rituals: [String],
  festivals: [String],
  famousArtisans: [{
    name: String,
    description: String,
    image: String
  }],
  relatedEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TextileEncyclopedia'
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  images: [String],
  tags: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
textileEncyclopediaSchema.index({ 
  name: 'text', 
  history: 'text', 
  'interestingFacts.fact': 'text' 
});
textileEncyclopediaSchema.index({ category: 1 });
textileEncyclopediaSchema.index({ 'origin.state': 1 });

module.exports = mongoose.model('TextileEncyclopedia', textileEncyclopediaSchema);