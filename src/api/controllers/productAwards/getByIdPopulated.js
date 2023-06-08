const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');

exports.getByIdPopulated = async (req, res, next) => {
  const productAwardId = req.params.id;

  const findQuery = productAwardModel.findById(productAwardId)
    .populate('product_id')
    .populate('award_id');

  findQuery.exec(function (err, productAward) {
    if (err) {
      const errorMessage = `Unable to find product award by ID: ${productAwardId}`;
      console.log(errorMessage);
      logger.error(errorMessage, err);
      return res.status(500).json({ error: "Unable to find product award by ID" });
    }
    if (!productAward) {
      const errorMessage = `Product award not found with ID: ${productAwardId}`;
      console.log(errorMessage);
      logger.error(errorMessage);
      return res.status(404).json({ error: "Product award not found" });
    }
    console.log(`Retrieved populated product award with ID: ${productAwardId}`);
    res.json({ productAward });
  });
};
