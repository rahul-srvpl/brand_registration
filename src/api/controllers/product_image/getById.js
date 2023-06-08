const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');

exports.getById = async (req, res, next) => {

  try {
    const imgId = req.params.id;
    const image_list = await ProductImage.findById(imgId);
    console.log(`Retrieved image with ID: ${imgId}`);
    res.send({ image_list })
  } catch (err) {
    const errorMessage = `Failed to get image by ID: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "Failed to get image by ID", error: err.message });
  }
};
