const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.getByIdPopulated = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const category = await categoryModel.findById(categoryId)
      .populate('parent_category_id')
      .populate('sub_category_id')
      .exec();

    if (!category) {
      logger.error(`Category not found`);
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ category });
  } catch (err) {
    logger.error(`Unable to find category by ID: ${err.message}`);
    console.log(`Unable to find category by ID: ${err.message}`);
    res.status(500).json({ error: "Unable to find category by ID" });
  }
};
