const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'brand'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'canceled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  features: {
    unlimitedGeneration: {
      type: Boolean,
      default: false
    },
    pricingCalculator: {
      type: Boolean,
      default: false
    },
    shippingEstimator: {
      type: Boolean,
      default: false
    },
    designHistory: {
      type: Boolean,
      default: false
    },
    contactArtisans: {
      type: Boolean,
      default: false
    },
    downloadHD: {
      type: Boolean,
      default: false
    },
    commercialLicense: {
      type: Boolean,
      default: false
    }
  },
  paymentDetails: {
    transactionId: String,
    paymentMethod: String,
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for expiration checks
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);