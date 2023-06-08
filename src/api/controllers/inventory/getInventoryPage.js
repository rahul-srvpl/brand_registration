const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory'); // Added productImage model import
const mquery = require('express-mquery');

exports.getInventoryPage = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = { createdAt: -1 }, select } = req.mquery;

    const pipeline = [
      { '$match': filter },
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
      { '$match': { 'product.approval_status': 'approved' } },
      { '$limit': paginate.limit },
      { '$skip': paginate.skip },
      { '$sort': sort }
    ];

    if (select) {
      pipeline.push({ '$project': select });
    }
    pipeline.push({
      '$addFields': {
        'business_price': { $toDouble: '$business_price' },
        'list_price': { $toDouble: '$list_price' },
        'max_retail_price': { $toDouble: '$max_retail_price' },
        'fixed_price1': { $toDouble: '$fixed_price1' },
        'fixed_price2': { $toDouble: '$fixed_price2' },
        'fixed_price3': { $toDouble: '$fixed_price3' },
      }
    });

    const findQuery = inventoryModel.aggregate(pipeline);

    const inventoryList = await findQuery.exec();

    const count = inventoryList.length;

    const successMessage = `Successfully retrieved inventory page: ${paginate.skip} to ${paginate.skip + paginate.limit}`;
    logger.info(successMessage);
    console.log(successMessage); // Console log

    res.send({ from: paginate.skip, size: paginate.limit, count: count, inventoryList });

  } catch (err) {
    const errorMessage = `Failed to get inventory: ${err.message}`;
    logger.error(errorMessage);
    console.log(errorMessage); // Console log

    res.status(500);
    res.send({ "message": "unable to get inventory", error: err.message });
  }
};
