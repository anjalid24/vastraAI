const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['material', 'printing', 'artisan', 'shipping', 'tax', 'custom'],
    required: true
  },
  conditions: {
    patternType: String,
    materialType: String,
    region: String,
    quantity: {
      min: Number,
      max: Number
    },
    complexity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    urgency: {
      type: String,
      enum: ['normal', 'express']
    }
  },
  calculation: {
    type: {
      type: String,
      enum: ['fixed', 'percentage', 'per_unit', 'slab'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    maxValue: Number,
    minValue: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  applicability: {
    userRoles: [{
      type: String,
      enum: ['free', 'brand', 'artisan', 'admin']
    }],
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index
pricingRuleSchema.index({ category: 1, 'applicability.isActive': 1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);