const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');

exports.getById = async (req, res, next) => {

  try {
    const productAwardId = req.params.id;
    const productAward = await productAwardModel.findById(productAwardId);

    if (!productAward) {
      const errorMessage = `Product award not found with ID: ${productAwardId}`;
      console.log(errorMessage);
      logger.error(errorMessage);
      return res.status(404).send("Product award not found");
    }

    console.log(`Retrieved product award with ID: ${productAwardId}`);
    res.send({ productAward });
  } catch (err) {
    const errorMessage = `Failed to get product award by ID: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "Failed to get product award by ID", error: err.message });
  }
};
