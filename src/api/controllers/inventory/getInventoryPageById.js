const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory');

exports.getInventoryPageById = async (req, res, next) => {
  try {
    const inventoryId = req.params.id;

    const pipeline = [
      { '$match': { _id: new mongoose.Types.ObjectId(inventoryId) } },
      {
        '$lookup': {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            { $project: { product_sku: 1, product_external_id: 1, product_external_id_type: 1, item_name: 1, condition: 1, approval_status: 1 } }
          ]
        }
      },
      {
        '$lookup': {
          from: 'products',
          localField: 'parent_product_id',
          foreignField: '_id',
          as: 'parent_product',
          pipeline: [
            { $project: { product_sku: 1, product_external_id: 1, product_external_id_type: 1, item_name: 1, condition: 1, approval_status: 1 } }
          ]
        }
      },
      {
        '$lookup': {
          from: 'product_images',
          let: { productId: '$product_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
            { $project: { main_img: 1 } }
          ],
          as: 'product_images'
        }
      },
      { '$match': { 'product.approval_status': 'approved' } }
    ];

    pipeline.push({
      '$addFields': {
        'business_price': { $toDouble: '$business_price' },
        'list_price': { $toDouble: '$list_price' },
        'max_retail_price': { $toDouble: '$max_retail_price' },
        'fixed_price1': { $toDouble: '$fixed_price1' },
        'fixed_price2': { $toDouble: '$fixed_price2' },
        'fixed_price3': { $toDouble: '$fixed_price3' }
      }
    });

    const inventory = await inventoryModel.aggregate(pipeline).exec();

    if (!inventory) {
      const errorMessage = "Inventory not found";
      logger.error(errorMessage);
      console.log(errorMessage); // Console log

      return res.status(404).json({ error: "Inventory not found" });
    }

    const successMessage = "Successfully retrieved inventory by ID";
    logger.info(successMessage);
    console.log(successMessage); // Console log

    res.json({ inventory });
  } catch (error) {
    const errorMessage = "Unable to get inventory";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(500).json({ error: "Unable to get inventory" });
  }
};
