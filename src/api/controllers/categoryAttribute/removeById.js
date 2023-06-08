const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

exports.removeById = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const result = await categoryAttributeModel.findByIdAndDelete(categoryId);

    if (!result) {
      const errorMessage = `Unable to remove category by ID: Category not found`;
      logger.error(errorMessage);
      console.log(errorMessage);
      res.status(404).send({ message: "Unable to remove category by ID", error: "Category not found" });
      return;
    }

    const logMessage = `Category removed by ID: ${categoryId}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send({ success: true });
  } catch (err) {
    const errorMessage = `Error occurred while removing category by ID: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ message: "Error occurred while removing category by ID", error: err });
  }
};
