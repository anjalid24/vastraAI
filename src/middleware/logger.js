const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

// Get current log level from env
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Write log to file
const writeLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };

  // Console log with color
  const colors = {
    INFO: '\x1b[32m', // Green
    WARN: '\x1b[33m', // Yellow
    ERROR: '\x1b[31m', // Red
    DEBUG: '\x1b[36m' // Cyan
  };

  const colorReset = '\x1b[0m';
  console.log(
    `${colors[level] || ''}[${timestamp}] ${level}: ${message}${data ? ' ' + JSON.stringify(data) : ''}${colorReset}`
  );

  // Write to file (daily log file)
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(
    logFile,
    JSON.stringify(logEntry) + '\n',
    'utf8'
  );
};

// Check if should log at this level
const shouldLog = (level) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentIndex = levels.indexOf(CURRENT_LOG_LEVEL.toLowerCase());
  const levelIndex = levels.indexOf(level.toLowerCase());
  return levelIndex >= currentIndex;
};

// Logger middleware for Express
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Log request
  if (shouldLog('info')) {
    writeLog(LOG_LEVELS.INFO, `${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || 'anonymous'
    });
  }

  // Override end method to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    
    if (shouldLog(logLevel === LOG_LEVELS.ERROR ? 'error' : 'info')) {
      writeLog(logLevel, `${req.method} ${req.url} - ${res.statusCode}`, {
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        contentLength: res.get('content-length') || 0
      });
    }

    originalEnd.apply(this, args);
  };

  next();
};

// Logging functions
const logger = {
  info: (message, data) => {
    if (shouldLog('info')) writeLog(LOG_LEVELS.INFO, message, data);
  },
  warn: (message, data) => {
    if (shouldLog('warn')) writeLog(LOG_LEVELS.WARN, message, data);
  },
  error: (message, data) => {
    if (shouldLog('error')) writeLog(LOG_LEVELS.ERROR, message, data);
  },
  debug: (message, data) => {
    if (shouldLog('debug')) writeLog(LOG_LEVELS.DEBUG, message, data);
  },
  middleware: loggerMiddleware
};

module.exports = logger;