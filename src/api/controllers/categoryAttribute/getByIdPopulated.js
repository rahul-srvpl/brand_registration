const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

exports.getByIdPopulated = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const category = await categoryAttributeModel.findById(categoryId)
      .populate('attribute_id')
      .populate('category_id')
      .exec();

    if (!category) {
      const errorMessage = "Category not found";
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(404).json({ error: errorMessage });
    }

    const logMessage = `Retrieved populated category by ID: ${categoryId}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.json({ category });
  } catch (error) {
    const errorMessage = `Unable to find category by ID: ${error}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).json({ error: "Unable to find category by ID" });
  }
};
