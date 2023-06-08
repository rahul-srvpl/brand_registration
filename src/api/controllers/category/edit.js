const mongoose = require('mongoose');
const Joi = require('joi');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

const categoryValidationSchema = Joi.object({
  category_slug: Joi.string(),
  status: Joi.string().valid('active', 'archived', 'draft'),
  category_name: Joi.string(),
  category_desc: Joi.string(),
  category_type: Joi.string().valid('parent', 'sub', 'child'),
  parent_category_id: Joi.string(),
  sub_category_id: Joi.string(),
  associated_attributes: Joi.array().items(Joi.object({
    attribute_id: Joi.string(),
    required: Joi.boolean(),
    recommended: Joi.boolean(),
  }))
});

exports.edit = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const query = { _id: categoryId };
    const categoryInfo = req.body;
    delete categoryInfo._id;

    const { error } = categoryValidationSchema.validate(categoryInfo);
    if (error) {
      console.log("Invalid request body", error);
      logger.info("Invalid request body", error);
      res.status(400).json({ "message": error.details[0].message });
      return;
    }

    const updatedCategory = await categoryModel.findOneAndUpdate(query, categoryInfo, { new: true });
    if (!updatedCategory) {
      console.log("No records found");
      logger.info("No records found");
      res.status(400).json({ "message": "No records found" });
      return;
    }
    res.json({ "success": true, "updated_entry": updatedCategory });
  } catch (err) {
    console.log("Unable to update document", err.message);
    logger.error("Unable to update document", err.message);
    res.status(500).json({ "message": err.message });
  }
};
