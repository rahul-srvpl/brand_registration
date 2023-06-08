const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const productAwardModel = require('../../models/productAward');
const variationModel = require('../../models/variation');

exports.removeById = async (req, res, next) => {
  const productId = req.params.id;

  try {
    await productModel.findByIdAndDelete(productId);
    await inventoryModel.findOneAndRemove({ product_id: productId });
    await productAwardModel.findOneAndRemove({ product_id: productId });
    await variationModel.findOneAndRemove({ product_id: productId });

    console.log(`Product removed: ${productId}`);

    res.send({ "success": true });
  } catch (err) {
    const errorMessage = `Unable to remove product by ID ${productId}: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    next(err.message);
  }
};
