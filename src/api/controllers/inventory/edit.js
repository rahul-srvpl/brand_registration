const mongoose = require('mongoose');
const Joi = require('joi');
const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory');
const productModel = require('../../models/product');

const inventoryValidationSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'draft', 'unlisted', 'supressed'),
  qty_available: Joi.number().min(0),
  list_price: Joi.number().min(0),
  max_retail_price: Joi.number().min(0),
  business_price: Joi.number().min(0),
  business_discount_type: Joi.string().valid('percent', 'fixed'),
  min_qty1: Joi.number().min(0),
  max_qty1: Joi.number().min(0),
  min_qty2: Joi.number().min(0),
  max_qty2: Joi.number().min(0),
  min_qty3: Joi.number().min(0),
  max_qty3: Joi.number().min(0),
  percent_off1: Joi.number().min(0),
  percent_off2: Joi.number().min(0),
  percent_off3: Joi.number().min(0),
  fixed_price1: Joi.number().min(0),
  fixed_price2: Joi.number().min(0),
  fixed_price3: Joi.number().min(0),
});

exports.edit = async (req, res, next) => {
  try {
    const inventoryId = req.params.id;
    const query = { _id: inventoryId };
    const inventoryInfo = req.body;
    delete inventoryInfo._id;

    const { error } = inventoryValidationSchema.validate(inventoryInfo);
    if (error) {
      const errorMessage = `Invalid request body: ${error.details[0].message}`;
      logger.info(errorMessage);
      console.log(errorMessage); // Console log
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const updatedInventory = await inventoryModel.findOneAndUpdate(query, inventoryInfo, { new: true });
    if (!updatedInventory) {
      const noRecordsMessage = "No records found";
      logger.info(noRecordsMessage);
      console.log(noRecordsMessage); // Console log
      res.status(400).json({ message: noRecordsMessage });
      return;
    }

    // Update the corresponding product record
    const productId = updatedInventory.product_id;
    const productUpdate = { list_price: updatedInventory.list_price, max_retail_price: updatedInventory.max_retail_price };
    const updatedProduct = await productModel.findOneAndUpdate({ _id: productId }, productUpdate, { new: true });

    res.json({ success: true, updated_inventory: updatedInventory, updated_product: updatedProduct });
  } catch (err) {
    const errorMessage = `Unable to update document: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage); // Console log
    res.status(500).json({ message: err.message });
  }
};
