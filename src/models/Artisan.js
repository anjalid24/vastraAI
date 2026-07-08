const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema(
  {
    // The user account (role: artisan) this profile belongs to.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Artisan name is required'],
      trim: true,
    },
    craft: {
      type: String,
      required: [true, 'Craft/speciality is required'],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
    },
    skills: [{ type: String, trim: true }],
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artisan', artisanSchema);
