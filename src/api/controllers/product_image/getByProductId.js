const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');

exports.getByProductId = async (req, res, next) => {

  try {
    const productId = req.params.id;
    console.log(`Product ID: ${productId}`);
    const image_list = await ProductImage.findOne({ product_id: productId.toString() });
    console.log(`Retrieved image list for product ID: ${productId}`);
    res.send({ image_list })
  } catch (err) {
    const errorMessage = `Failed to get image list by ID: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "Failed to get image list by ID", error: err.message });
  }
};
