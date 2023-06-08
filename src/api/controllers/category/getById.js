const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.getById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    res.send({ category });
  } catch (err) {
    logger.error(`Failed to get category by ID: ${err.message}`);
    console.log(`Failed to get category by ID: ${err.message}`);
    res.status(500).send({ "message": "Failed to get category by ID", error: err });
  }
};
