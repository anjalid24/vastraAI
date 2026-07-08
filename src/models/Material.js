const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Material name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Material type is required'],
      trim: true, // e.g. fabric, dye, thread, embellishment
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
      default: 'meter', // meter, kg, piece
    },
    pricePerUnit: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Artisan who supplies / produces this material (optional).
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
