const logger = require('../../../config/logger');
const attributeModel = require('../../models/attribute');

exports.removeById = async (req, res, next) => {
  const attributeId = req.params.id;

  try {
    await attributeModel.findByIdAndDelete(attributeId);
    const successMessage = "Record removed successfully for ID:";
    logger.info(successMessage, attributeId);
    console.log(successMessage, attributeId);
    res.send({ "success": true });
  } catch (err) {
    const errorMessage = "Unable to remove by ID";
    logger.error(errorMessage, err.message);
    console.log(errorMessage, err.message);
    res.status(500).send({ error: err.message });
  }
};
