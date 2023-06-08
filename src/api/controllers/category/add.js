const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.add = async (req, res, next) => {
  try {
    const categoryData = new categoryModel(req.body);

    // Validate request body using Joi schema
    const categorySchema = Joi.object({
      category_slug: Joi.string().required(),
      status: Joi.string().valid('active', 'archived', 'draft').default('active'),
      category_name: Joi.string().required(),
      category_desc: Joi.string().required(),
      category_type: Joi.string().valid('parent', 'sub', 'child').required(),
      parent_category_id: Joi.when('category_type', { is: Joi.string().valid('sub', 'child'), then: Joi.string().required() }),
      sub_category_id: Joi.when('category_type', { is: 'child', then: Joi.string().required() })
    });
    const { error } = categorySchema.validate(req.body);
    if (error) {
      console.log("validation error", error);
      logger.info("validation error", error);
      res.status(400).send({ "message": error.details[0].message });
      return;
    }

    const result = await categoryData.save();

    res.send({ "success": true, "added_entry": result });
  } catch (err) {
    console.log("unable to insert document", err.message);
    logger.error("unable to insert document", err.message);
    res.status(500).send({ "message": "Unable to insert document", "error": err });
  }
};
