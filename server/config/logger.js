const pino = require('pino');

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Base logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: process.env.NODE_ENV || 'development',
    pid: process.pid,
  },
  // Redact sensitive information
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'token',
      'secret',
      'apiKey',
    ],
    remove: true,
  },
};

// Development configuration with pretty printing
if (isDevelopment) {
  loggerConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
      hideObject: false,
      messageFormat: '{msg}',
      errorLikeObjectKeys: ['err', 'error'],
    },
  };
}

// Create and export the logger instance
const logger = pino(loggerConfig);

// Export logger instance
module.exports = logger;
