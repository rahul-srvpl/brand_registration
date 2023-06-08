const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const variationModel = require('../../models/variation');

exports.getById = async (req, res, next) => {
  try {
    const variationId = req.params.id;
    const findQuery = variationModel.findById(variationId);
    const variation = await findQuery.exec();

    if (!variation) {
      const notFoundMessage = "No variation record found for ID:";
      logger.info(notFoundMessage, variationId);
      console.log(notFoundMessage, variationId);
      res.status(400).json({ message: "No records found" });
      return;
    }

    const successMessage = "Variation data retrieved successfully for ID:";
    logger.info(successMessage, variationId);
    console.log(successMessage, variationId);
    res.json({ variation });
  } catch (err) {
    const errorMessage = "Error while getting variation data by ID:";
    logger.error(errorMessage, err);
    console.log(errorMessage, err);
    res.status(500).send({ message: 'An error occurred while fetching variation data by ID.', error: err.message });
  }
};
