const mongoose = require('mongoose');
const Joi = require('joi');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

const categoryAttributeSchema = Joi.object({
  required: Joi.boolean(),
  recommended: Joi.boolean()
});

exports.edit = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const query = { _id: categoryId };
    const categoryInfo = req.body;
    delete categoryInfo._id;

    const { error } = categoryAttributeSchema.validate(categoryInfo);
    if (error) {
      const errorMessage = `Invalid request body: ${error.details[0].message}`;
      logger.info(errorMessage);
      console.log(errorMessage);
      res.status(400).json({ "message": errorMessage });
      return;
    }

    const updatedCategory = await categoryAttributeModel.findOneAndUpdate(query, categoryInfo, { new: true });
    if (!updatedCategory) {
      const errorMessage = "No records found";
      logger.info(errorMessage);
      console.log(errorMessage);
      res.status(400).json({ "message": errorMessage });
      return;
    }
    res.json({ "success": true, "updated_entry": updatedCategory });
  } catch (err) {
    const errorMessage = `Unable to update document: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).json({ "message": errorMessage });
  }
};
