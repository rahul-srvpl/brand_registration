const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeGroupModel = require('../../models/attributeGroup');

exports.add = async (req, res, next) => {
  try {
    const attributeData = new attributeGroupModel(req.body);

    // Validate request body using Joi schema

    const attributeGroupSchema = Joi.object({
      group_slug: Joi.string().trim().lowercase().required(),
      group_name: Joi.string().trim().required(),
      group_desc: Joi.string().trim(),
      status: Joi.string().valid('active', 'archived', 'draft').default('active')
    });

    const { error } = attributeGroupSchema.validate(req.body);
    if (error) {
      const errorMessage = "Validation error:";
      logger.info(errorMessage, error);
      console.log(errorMessage, error);
      res.status(400).send({ "message": error.details[0].message });
      return;
    }

    const result = await attributeData.save();

    logger.info("Document inserted successfully:", result);
    console.log("Document inserted successfully:", result);
    res.send({ "success": true, "added_entry": result });
  } catch (err) {
    const errorMessage = "Unable to insert document:";
    logger.error(errorMessage, err.message);
    console.log(errorMessage, err.message);
    res.status(500).send({ "message": "Unable to insert document", "error": err.message });
  }
};
