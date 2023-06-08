const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');

exports.getById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    console.log(`Product found: ${product}`);

    res.send({ product });
  } catch (err) {
    const errorMessage = `Failed to get product by ID: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "Failed to get product by ID", error: err.message });
  }
};
