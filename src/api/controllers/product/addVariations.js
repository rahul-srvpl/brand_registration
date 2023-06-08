const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const variationModel = require('../../models/variation');

exports.addVariations = async (req, res, next) => {
  try {
    const parent_id = req.body.parent_id;
    const variationDataArray = req.body.variation_data;

    let added_products = [];
    let added_inventory = [];

    const parent_product = await productModel.findOne({ _id: parent_id }).exec();

    for (let i = 0; i < variationDataArray.length; i++) {
      const variationData = variationDataArray[i];
      const new_product = Object.assign({}, parent_product._doc);

      delete new_product._id;
      delete new_product.createdAt;
      delete new_product.updatedAt;
      new_product.variation_group_id = parent_id;
      new_product.variation_name1 = variationData.variation_name1;
      new_product.variation_value1 = variationData.variation_value1;
      new_product.variation_name2 = variationData.variation_name2;
      new_product.variation_value2 = variationData.variation_value2;
      new_product.product_sku = variationData.product_sku;
      new_product.product_external_id = variationData.product_external_id;
      new_product.product_external_id_type = variationData.product_external_id_type;
      new_product.item_condition = variationData.item_condition;
      new_product.max_retail_price = variationData.max_retail_price;
      new_product.list_price = variationData.list_price;
      new_product.offer_start_date_offer = variationData.offer_start_date_offer;
      new_product.offer_end_date_offer = variationData.offer_end_date_offer;

      const product_result = await productModel.create(new_product);

      const variations = new variationModel({
        product_id: product_result._id,
        variation_group_id: parent_id,
        variation_name1: product_result.variation_name1,
        variation_value1: product_result.variation_value1,
        variation_name2: product_result.variation_name2,
        variation_value2: product_result.variation_value2
      })
      const variation_result = await variations.save();


      const inventoryData = new inventoryModel({
        product_id: product_result._id,
        seller_id: product_result.seller_id,
        max_retail_price: product_result.max_retail_price,
        list_price: product_result.list_price,
        qty_available: variationData.qty,
        has_variations: true,
        variation_group_id: parent_id
      });
      const inventory_result = await inventoryData.save();

      const delete_parent = await productModel.findByIdAndRemove(parent_id);

      added_products.push(product_result);
      added_inventory.push(inventory_result);

      console.log(`Variation added: ${product_result}`);
      console.log(`Inventory added: ${inventory_result}`);
    }

    res.send({ "success": true, "added_products": added_products, "added_inventory": added_inventory });
  } catch (err) {
    const errorMessage = `Unable to insert document: ${err.message}`;
    console.log(errorMessage);
    logger.info(errorMessage);
    res.status(500).send({ "message": err.message });
  }
};
