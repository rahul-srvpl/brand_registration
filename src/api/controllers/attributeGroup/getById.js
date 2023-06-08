const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeGroupModel = require('../../models/attributeGroup');

exports.getById = async (req, res, next) => {
  try {
    const attributeId = req.params.id;
    const attribute = await attributeGroupModel.findById(attributeId);

    logger.info("Attribute data retrieved successfully for ID:", attributeId);
    console.log("Attribute data retrieved successfully for ID:", attributeId);

    res.send({ attribute });
  } catch (err) {
    const errorMessage = `Failed to get category by ID: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage);

    res.status(500).send({ "message": "Failed to get category by ID", error: err.message });
  }
};
