const winston = require('winston');
const { combine, timestamp, label, prettyPrint } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: combine(
        timestamp(),
        prettyPrint()
      )
    }), // Add console transport
  ],
  format: combine(
    timestamp(),
    prettyPrint()
  ),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
