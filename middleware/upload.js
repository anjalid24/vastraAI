const multer = require('multer');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('./logger');

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vastra-ai',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    transformation: [
      { width: 2048, height: 2048, crop: 'limit' },
      { quality: 'auto:best' },
      { fetch_format: 'auto' }
    ]
  }
});

// Local storage fallback (if Cloudinary fails)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn('Invalid file type attempted', { mimetype: file.mimetype, filename: file.originalname });
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.'), false);
  }
};

// Create multer instance with Cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Local upload instance (fallback)
const localUpload = multer({
  storage: localStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: 10
  },
  fileFilter: fileFilter
});

// Single file upload
exports.uploadSingle = upload.single('image');

// Multiple files upload
exports.uploadMultiple = upload.array('images', 10);

// Single file upload with local storage (fallback)
exports.uploadSingleLocal = localUpload.single('image');

// Multiple files upload with local storage (fallback)
exports.uploadMultipleLocal = localUpload.array('images', 10);

// Handle upload errors
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', { error: err.message, code: err.code });
    
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is ' + (parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)) + 'MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum allowed: 10'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected file field. Please check the field name.'
      });
    }
    
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err) {
    logger.error('Upload error:', err);
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next();
};

// Validate file exists
exports.validateFileExists = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded. Please select a file to upload.'
    });
  }
  next();
};