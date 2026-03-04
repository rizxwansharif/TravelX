const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Format timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Format log message
const formatLogMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...(Object.keys(meta).length > 0 && { meta })
  });
};

// Write to file
const writeLog = (level, message, meta = {}) => {
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  const logMessage = formatLogMessage(level, message, meta) + '\n';
  
  fs.appendFileSync(logFile, logMessage);
};

// Console log with colors
const colorize = (level, message) => {
  const colors = {
    ERROR: '\x1b[31m', // Red
    WARN: '\x1b[33m',  // Yellow
    INFO: '\x1b[36m',  // Cyan
    DEBUG: '\x1b[35m'  // Magenta
  };
  const reset = '\x1b[0m';
  
  return `${colors[level] || ''}[${level}] ${message}${reset}`;
};

// Logger object
const logger = {
  error: (message, meta = {}) => {
    console.error(colorize('ERROR', message));
    writeLog('ERROR', message, meta);
  },

  warn: (message, meta = {}) => {
    console.warn(colorize('WARN', message));
    writeLog('WARN', message, meta);
  },

  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(colorize('INFO', message));
    }
    writeLog('INFO', message, meta);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(colorize('DEBUG', message));
    }
    writeLog('DEBUG', message, meta);
  }
};

module.exports = logger;
