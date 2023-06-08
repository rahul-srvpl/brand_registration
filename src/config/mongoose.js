const mongoose = require('mongoose');
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');
const bluebird = require('bluebird');

// Set Bluebird as the mongoose Promise library
mongoose.Promise = bluebird;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Print Mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to MongoDB
 *
 * @returns {Promise<Mongoose.Connection>}
 * @public
 */
exports.connect = async () => {
  try {
    await mongoose.connect(mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected...');
    return mongoose.connection;
  } catch (err) {
    logger.error(`Failed to connect to MongoDB: ${err}`);
    process.exit(-1);
  }
};

/**
 * Disconnect from MongoDB
 *
 * @public
 */
exports.disconnect = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected...');
    process.exit(0);
  } catch (err) {
    logger.error(`Error while disconnecting from MongoDB: ${err}`);
    process.exit(-1);
  }
};
