const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory');

exports.getById = async (req, res, next) => {
  try {
    const inventoryId = req.params.id;
    const inventory = await inventoryModel.findById(inventoryId);
    res.send({ inventory });

    const successMessage = `Inventory retrieved successfully for ID: ${inventoryId}`;
    logger.info(successMessage);
    console.log(successMessage); // Console log

  } catch (err) {
    const errorMessage = `Failed to get inventory by ID: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage); // Console log

    res.status(500).send({ "message": "Failed to get inventory by ID", error: err.message });
  }
};
