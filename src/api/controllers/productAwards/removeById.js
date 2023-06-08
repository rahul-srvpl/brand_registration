const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');

exports.removeById = async (req, res, next) => {
  const productAwardId = req.params.id;

  try {
    await productAwardModel.findByIdAndDelete(productAwardId);
    res.send({ "success": true });
  } catch (err) {
    const errorMessage = `Unable to remove product award by ID ${productAwardId}: ${err.message}`;
    logger.error(errorMessage);
    res.status(500).send({ "message": "Unable to remove product award by ID", error: err.message });
  }
};
