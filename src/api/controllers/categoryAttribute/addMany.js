const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');

exports.addMany = async (req, res, next) => {
  try {
    const { error } = Joi.array().items(Joi.object({
      attribute_id: Joi.string().required(),
      category_id: Joi.string().required(),
      required: Joi.boolean(),
      recommended: Joi.boolean()
    })).validate(req.body);
    if (error) {
      const errorMessage = `Validation error: ${error.details[0].message}`;
      logger.info(errorMessage);
      console.log(errorMessage);
      res.status(400).send({ "message": errorMessage });
      return;
    }

    // Delete existing documents
    const deleted = await categoryAttributeModel.deleteMany({ category_id: req.body[0].category_id });

    const categoryData = req.body.map(data => new categoryAttributeModel(data));
    const result = await categoryAttributeModel.create(categoryData);

    res.send({ "success": true, "added_entries": result });
  } catch (err) {
    const errorMessage = `Unable to insert documents: ${err}`;
    logger.info(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": "Unable to insert documents", "error": errorMessage });
  }
};
