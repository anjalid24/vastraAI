const mongoose = require('mongoose');

// Allowed fabric categories. Kept inline (module-local) since no other
// module needs them; extend this list as the catalogue grows.
const MATERIAL_CATEGORIES = [
  'Cotton',
  'Silk',
  'Linen',
  'Wool',
  'Rayon',
  'Polyester',
  'Denim',
  'Velvet',
  'Other',
];

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: [true, 'Material name is required'],
      unique: true, // enforces a unique index at the DB level
      trim: true,
      minlength: [2, 'Material name must be at least 2 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: MATERIAL_CATEGORIES,
        message: '{VALUE} is not a supported category',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    pricePerMeter: {
      type: Number,
      required: [true, 'Price per meter is required'],
      min: [0, 'Price per meter cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      // Guard against fractional stock counts.
      validate: {
        validator: Number.isInteger,
        message: 'Stock quantity must be a whole number',
      },
    },
    colorOptions: {
      type: [String],
      default: [],
      // Trim each colour string as it is set.
      set: (colors) =>
        Array.isArray(colors)
          ? colors.map((c) => (typeof c === 'string' ? c.trim() : c)).filter(Boolean)
          : colors,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    supplierName: {
      type: String,
      trim: true,
      default: '',
    },
    countryOfOrigin: {
      type: String,
      trim: true,
      default: '',
    },
    sustainabilityRating: {
      type: Number,
      min: [1, 'Sustainability rating must be between 1 and 5'],
      max: [5, 'Sustainability rating must be between 1 and 5'],
      validate: {
        validator: (v) => v === undefined || v === null || Number.isInteger(v),
        message: 'Sustainability rating must be a whole number between 1 and 5',
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Material', materialSchema);
module.exports.MATERIAL_CATEGORIES = MATERIAL_CATEGORIES;
