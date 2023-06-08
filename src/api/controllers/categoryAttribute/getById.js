const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

exports.getById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryAttributeModel.findById(categoryId);

    const logMessage = `Retrieved category by ID: ${categoryId}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send({ category });
  } catch (err) {
    const errorMessage = `Failed to get category by ID: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": "Failed to get category by ID", error: errorMessage });
  }
};
