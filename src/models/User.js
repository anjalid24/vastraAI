const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  role: {
    type: String,
    enum: ['free', 'brand', 'artisan', 'admin'],
    default: 'free'
  },
  profilePicture: {
    type: String,
    default: null
  },
  generationCount: {
    type: Number,
    default: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmark'
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  artisanProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user can generate more designs
userSchema.methods.canGenerateDesign = function() {
  if (this.role === 'brand' || this.role === 'admin') {
    return true;
  }
  
  // Check if monthly limit reset is needed
  const now = new Date();
  const lastReset = new Date(this.lastReset);
  const monthDiff = now.getMonth() - lastReset.getMonth() + 
    (12 * (now.getFullYear() - lastReset.getFullYear()));
  
  if (monthDiff >= 1) {
    this.generationCount = 0;
    this.lastReset = now;
    return true;
  }
  
  // Free users get 1 generation per month
  return this.generationCount < 1;
};

// Increment generation count
userSchema.methods.incrementGenerationCount = async function() {
  this.generationCount += 1;
  await this.save();
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    // Reset attempts if lock has expired
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
    }
  }
  await this.save();
};

module.exports = mongoose.model('User', userSchema);