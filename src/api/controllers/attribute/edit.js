const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeModel = require('../../models/attribute');
const Joi = require('joi');

exports.edit = async (req, res, next) => {
  const attributeId = req.params.id;
  const query = { _id: attributeId };
  const attributeInfo = req.body;
  delete attributeInfo._id;

  // Define the validation schema
  const schema = Joi.object({
    attribute_slug: Joi.string(),
    attribute_name: Joi.string(),
    attribute_group_slug: Joi.string(),
    attribute_group_name: Joi.string(),
    attribute_desc: Joi.string(),
    input_type: Joi.string(),
    data_type: Joi.string(),
    status: Joi.string().valid('active', 'archived', 'draft')
  });

  // Validate the request body against the schema
  const { error } = schema.validate(attributeInfo);
  if (error) {
    const errorMessage = `Validation error: ${error.message}`;
    logger.info(errorMessage);
    console.log(errorMessage);
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    const updatedAttribute = await attributeModel.findOneAndUpdate(query, attributeInfo, { new: true });
    if (!updatedAttribute) {
      const errorMessage = `No records found for ID: ${attributeId}`;
      logger.info(errorMessage);
      console.log(errorMessage);
      res.status(400).json({ message: "No records found" });
      return;
    }
    const successMessage = `Document updated successfully: ${updatedAttribute}`;
    logger.info(successMessage);
    console.log(successMessage);
    res.json({ success: true, "updated_entry": updatedAttribute });
  } catch (err) {
    const errorMessage = `Failed to update document: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).json({ "message": err.message });
  }
};
