const logger = require('../../../config/logger');
const attributeGroupModel = require('../../models/attributeGroup');

exports.removeById = async (req, res, next) => {
  try {
    const attributeId = req.params.id;

    const removedAttribute = await attributeGroupModel.findByIdAndDelete(attributeId);

    if (!removedAttribute) {
      const notFoundMessage = "No attribute group found for ID: " + attributeId;
      logger.info(notFoundMessage);
      console.log(notFoundMessage);
      res.status(400).json({ message: "No records found" });
      return;
    }

    const successMessage = "Attribute group removed successfully for ID: " + attributeId;
    logger.info(successMessage);
    console.log(successMessage);
    res.json({ success: true });
  } catch (err) {
    const errorMessage = "Unable to remove attribute group by ID: " + err.message;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ error: err.message });
  }
};
