const logger = require('../../../config/logger');
const variationModel = require('../../models/variation');

exports.removeById = async (req, res, next) => {
  const variationId = req.params.id;

  try {
    await variationModel.findByIdAndDelete(variationId);
    const successMessage = "Record removed successfully for ID:";
    logger.info(successMessage, variationId);
    console.log(successMessage, variationId);
    res.send({ success: true });
  } catch (err) {
    const errorMessage = "Unable to remove by ID";
    logger.error(errorMessage, err.message);
    console.log(errorMessage, err.message);
    res.status(500).send({ error: err.message });
  }
};
