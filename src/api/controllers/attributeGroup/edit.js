const mongoose = require('mongoose');
const Joi = require('joi');
const logger = require('../../../config/logger');
const attributeGroupModel = require('../../models/attributeGroup');

const attributeGroupSchema = Joi.object({
  group_name: Joi.string().trim(),
  group_desc: Joi.string().trim(),
  status: Joi.string().valid('active', 'archived', 'draft').default('active')
});

exports.edit = async (req, res, next) => {
  try {
    const attributeId = req.params.id;
    const query = { _id: attributeId };
    const attributeInfo = req.body;
    delete attributeInfo._id;

    const { error } = attributeGroupSchema.validate(attributeInfo);
    if (error) {
      const errorMessage = "Invalid request body:";
      logger.info(errorMessage, error);
      console.log(errorMessage, error);
      res.status(400).json({ "message": error.details[0].message });
      return;
    }

    const updatedAttribute = await attributeGroupModel.findOneAndUpdate(query, attributeInfo, { new: true });
    if (!updatedAttribute) {
      logger.info("No records found");
      console.log("No records found");
      res.status(400).json({ "message": "No records found" });
      return;
    }

    logger.info("Document updated successfully:", updatedAttribute);
    console.log("Document updated successfully:", updatedAttribute);
    res.json({ "success": true, "updated_entry": updatedAttribute });
  } catch (err) {
    const errorMessage = "Unable to update document:";
    logger.error(errorMessage, err.message);
    console.log(errorMessage, err.message);
    res.status(500).json({ "message": err.message });
  }
};
