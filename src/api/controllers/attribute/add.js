const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeModel = require('../../models/attribute');
const Joi = require('joi');

exports.add = async (req, res, next) => {
  try {
    const schema = Joi.object({
      attribute_slug: Joi.string().required(),
      attribute_name: Joi.string().required(),
      attribute_group_slug: Joi.string().required(),
      attribute_group_name: Joi.string().required(),
      attribute_desc: Joi.string(),
      input_type: Joi.string(),
      data_type: Joi.string()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = `Validation error: ${error.message}`;
      logger.info(errorMessage);
      console.log(errorMessage);
      res.status(400).send({ "message": error.message });
      return;
    }

    const attributeData = new attributeModel(req.body);
    const result = await attributeData.save();

    const successMessage = `Document inserted successfully: ${result}`;
    logger.info(successMessage);
    console.log(successMessage);
    res.send({ "success": true, "added_entry": result });
  } catch (err) {
    const errorMessage = `Failed to insert document: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": "Unable to insert document", "error": err.message });
  }
};
