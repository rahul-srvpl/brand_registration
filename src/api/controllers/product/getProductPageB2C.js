const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const mquery = require('express-mquery');

exports.getProductPageB2C = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(productId), approval_status: 'approved', status: "active" } },
      {
        $lookup: {
          from: 'product_images',
          let: { productId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
            { $project: { main_img: 1, img_2: 1, img_3: 1, img_4: 1, img_5: 1, img_6: 1, img_7: 1, img_8: 1 } }
          ],
          as: 'product_images'
        }
      },
      {
        $lookup: {
          from: 'countries',
          let: { countryId: '$country_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$countryId'] } } },
            { $project: { country_name: 1, image: 1 } }
          ],
          as: 'country'
        }
      },
      {
        $lookup: {
          from: 'brands',
          let: { brandId: '$brand_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$brandId'] } } },
            { $project: { brand_name: 1, brand_logo_url: 1 } }
          ],
          as: 'brand'
        }
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$child_category_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
            { $project: { category_name: 1 } }
          ],
          as: 'child_category'
        }
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$sub_category_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
            { $project: { category_name: 1 } }
          ],
          as: 'sub_category'
        }
      },
      {
        $lookup: {
          from: 'categories',
          let: { categoryId: '$parent_category_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
            { $project: { category_name: 1 } }
          ],
          as: 'parent_category'
        }
      },
      {
        $lookup: {
          from: 'awards',
          localField: 'awards',
          foreignField: '_id',
          pipeline: [
            { $project: { award_name: 1, award_description: 1, country: 1, image: 1 } }
          ],
          as: 'awards'
        }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'seller_id',
          foreignField: '_id',
          pipeline: [
            { $project: { fullname: 1 } }
          ],
          as: 'seller'
        }
      },
      {
        $lookup: {
          from: 'inventory',
          localField: '_id',
          foreignField: 'product_id',
          pipeline: [
            { $project: { qty_available: 1, list_price: 1, max_retail_price: 1 } },
            {
              $addFields: {
                'list_price': { $toDouble: '$list_price' },
                'max_retail_price': { $toDouble: '$max_retail_price' },
                'discount_percent': {
                  $toDouble: {
                    $round: [
                      {
                        $cond: {
                          if: { $ne: ['$max_retail_price', 0] },
                          then: {
                            $multiply: [
                              { $divide: [{ $subtract: ['$max_retail_price', '$list_price'] }, '$max_retail_price'] },
                              100
                            ]
                          },
                          else: 0
                        }
                      },
                      1
                    ]
                  }
                }
              }
            }
          ],
          as: 'inventory'
        }
      },
      {
        $addFields: {
          'list_price': { $toDouble: '$list_price' },
          'max_retail_price': { $toDouble: '$max_retail_price' }
        }
      }
    ];

    const product = await productModel.aggregate(pipeline);

    res.send(product);
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
    res.status(500).send(err.message);
  }
};
