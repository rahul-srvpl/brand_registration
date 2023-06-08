const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const userModel = require('../../models/user_b2b');

exports.getById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId)
      .select('-password -refreshToken -resetToken -resetTokenExpiration');
      
    res.send({ user });
  } catch (err) {
    logger.error(`Failed to get user by ID: ${err}`);
    res.status(500).send({ "message": "Failed to get user by ID", error: err });
  }
};
