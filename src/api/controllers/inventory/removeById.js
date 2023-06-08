const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory');

exports.removeById = async (req, res, next) => {
  try {
    const inventoryId = req.params.id;

    await inventoryModel.findByIdAndDelete(inventoryId);

    const successMessage = `Inventory removed successfully for ID: ${inventoryId}`;
    logger.info(successMessage);
    console.log(successMessage); // Console log

    res.send({ success: true });
  } catch (err) {
    const errorMessage = `Unable to remove by ID: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage); // Console log

    res.status(500).send({ message: err.message });
  }
};
