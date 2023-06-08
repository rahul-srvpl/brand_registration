const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const categoryModel = require('../../models/category');
const productAwardModel = require('../../models/productAward');
const brandModel = require('../../models/brand');

exports.add = async (req, res, next) => {
  try {
    const category_id = req.body.category_id;
    const awards = req.body.awards;
    delete req.body.awards;
    delete req.body.category_id;

    const category = await categoryModel.findById(category_id);

    const productData = new productModel(req.body);

    if (category.category_type === 'sub') {
      productData.sub_category_id = category._id;
      productData.parent_category_id = category.parent_category_id;
    }
    if (category.category_type === 'child') {
      productData.child_category_id = category._id;
      productData.sub_category_id = category.sub_category_id;
      productData.parent_category_id = category.parent_category_id;
    }
    if (category.category_type === 'parent') {
      productData.parent_category_id = category._id;
    }

    if (productData.has_brand === false) {
      genericBrand = await brandModel.findOne({ brand_type: "generic" });
      productData.brand_id = genericBrand._id;
    }

    let product_result = await productData.save();
    let inventory_result

    if (productData.has_variations === false) {
      const inventoryData = new inventoryModel({
        product_id: product_result._id,
        seller_id: product_result.seller_id,
        max_retail_price: product_result.max_retail_price,
        list_price: product_result.list_price,
        has_variations: false
      });

      inventory_result = await inventoryData.save();
    }

    if (awards) {
      const productAwardsData = awards.map(award => ({
        product_id: product_result._id,
        award_id: award.award_id,
        award_year: award.award_year,
        certificate_public_id: award.certificate_public_id,
        certificate_url: award.certificate_url
      }));

      const product_awards_result = await productAwardModel.insertMany(productAwardsData);

      // Store the award IDs in the product's awards array
      const awardIds = product_awards_result.map(pa => pa.award_id);

      product_result = await productModel.findByIdAndUpdate(
        product_result._id,
        { $set: { awards: awardIds } },
        { new: true }
      );
    }

    console.log(`Product added: ${product_result}`);
    console.log(`Inventory added: ${inventory_result}`);
    res.send({ "success": true, "added_product": product_result, "added_inventory": inventory_result });
  } catch (err) {
    const errorMessage = `Unable to insert document: ${err.message}`;
    console.log(errorMessage);
    logger.info(errorMessage);
    res.status(500).send({ "message": err.message });
  }
};
