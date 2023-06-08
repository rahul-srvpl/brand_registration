const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const productAwardModel = require('../../models/productAward');

exports.edit = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const query = { _id: productId };

    if (req.body.awards) {
      const awards = req.body.awards;
      delete req.body.awards;
      const deleted = await productAwardModel.deleteMany({ product_id: productId });

      const productAwardsData = awards.map(award => ({
        product_id: productId,
        award_id: award.award_id,
        award_year: award.award_year,
        certificate_public_id: award.certificate_public_id
      }));

      const product_awards_result = await productAwardModel.insertMany(productAwardsData);

      // Store the award IDs in the product's awards array
      const awardIds = product_awards_result.map(pa => pa.award_id);
      console.log(`Award IDs: ${awardIds}`);
      await productModel.findByIdAndUpdate(productId, { $set: { awards: awardIds } });
    }

    const productInfo = req.body;
    delete productInfo._id;

    const updatedProduct = await productModel.findOneAndUpdate(query, productInfo, { new: true });

    if (!updatedProduct) {
      const errorMessage = "No records found";
      console.log(errorMessage);
      logger.info(errorMessage);
      res.status(400).json({ "message": "No records found" });
      return;
    }

    // Update the corresponding inventory records
    const inventoryUpdateQuery = { product_id: productId };
    const inventoryUpdate = { list_price: updatedProduct.list_price, max_retail_price: updatedProduct.max_retail_price };
    const updatedInventory = await inventoryModel.findOneAndUpdate(inventoryUpdateQuery, inventoryUpdate, { new: true });

    console.log(`Product updated: ${updatedProduct}`);
    console.log(`Inventory updated: ${updatedInventory}`);
    res.json({ "success": true, "updated_product": updatedProduct, "updated_inventory": updatedInventory });
  } catch (err) {
    const errorMessage = `Unable to update document: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).json({ "message": err.message });
  }
};
