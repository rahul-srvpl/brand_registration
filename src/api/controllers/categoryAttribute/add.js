const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

exports.add = async (req, res, next) => {
  try {
    const categoryData = new categoryAttributeModel(req.body);

    // Validate request body using Joi schema
    const categoryAttributeSchema = Joi.object({
      attribute_id: Joi.string().required(),
      category_id: Joi.string().required(),
      required: Joi.boolean(),
      recommended: Joi.boolean()
    });

    const { error } = categoryAttributeSchema.validate(req.body);
    if (error) {
      logger.info(`Validation error: ${error}`);
      res.status(400).send({ "message": error.details[0].message });
      return;
    }

    const result = await categoryData.save();

    res.send({ "success": true, "added_entry": result });
  } catch (err) {
    logger.info(`Unable to insert document: ${err}`);
    res.status(500).send({ "message": "Unable to insert document", "error": err });
  }
};
