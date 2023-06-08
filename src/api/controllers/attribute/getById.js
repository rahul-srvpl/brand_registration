const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeModel = require('../../models/attribute');

exports.getById = async (req, res, next) => {
  try {
    const attributeId = req.params.id;
    const findQuery = attributeModel.findById(attributeId);
    const attribute = await findQuery.exec();

    if (!attribute) {
      const notFoundMessage = "No attribute record found for ID:";
      logger.info(notFoundMessage, attributeId);
      console.log(notFoundMessage, attributeId);
      res.status(400).json({ message: "No records found" });
      return;
    }

    const successMessage = "Attribute data retrieved successfully for ID:";
    logger.info(successMessage, attributeId);
    console.log(successMessage, attributeId);
    res.json({ attribute });
  } catch (err) {
    const errorMessage = "Error while getting attribute data by ID:";
    logger.error(errorMessage, err.message);
    console.log(errorMessage, err.message);
    res.status(500).send({ message: 'An error occurred while fetching attribute data by ID.', error: err.message });
  }
};
