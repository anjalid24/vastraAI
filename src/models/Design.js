const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Design title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true, // e.g. saree, kurta, lehenga
    },
    tags: [{ type: String, trim: true }],
    imageUrl: {
      type: String,
      trim: true,
    },
    // Materials used in this design.
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
      },
    ],
    // Artisan(s) crafting the design.
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
    },
    // The brand (user) who owns/commissioned the design.
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed', 'archived'],
      default: 'draft',
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Design', designSchema);
