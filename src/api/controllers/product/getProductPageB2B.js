const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const mquery = require('express-mquery');

exports.getProductPageB2B = async (req, res, next) => {
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
            {
              $project: {
                qty_available: 1,
                business_price: { $toDouble: '$business_price' },
                business_discount_type: 1,
                min_qty1: 1, max_qty1: 1,
                min_qty2: 1, max_qty2: 1,
                min_qty3: 1, max_qty3: 1,
                percent_off1: 1, percent_off2: 1, percent_off3: 1,
                fixed_price1: 1, fixed_price2: 1, fixed_price3: 1
              }
            },
            {
              $addFields: {
                price_1: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$business_discount_type', 'percent'] },
                        { $ne: ['$percent_off1', null] }
                      ]
                    },
                    {
                      $round: [
                        { $multiply: ['$business_price', { $subtract: [1, { $divide: ['$percent_off1', 100] }] }] },
                        2
                      ]
                    },
                    { $toDouble: '$fixed_price1' }
                  ]
                },
                price_2: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$business_discount_type', 'percent'] },
                        { $ne: ['$percent_off2', null] }
                      ]
                    },
                    {
                      $round: [
                        { $multiply: ['$business_price', { $subtract: [1, { $divide: ['$percent_off2', 100] }] }] },
                        2
                      ]
                    },
                    { $toDouble: '$fixed_price2' }
                  ]
                },
                price_3: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$business_discount_type', 'percent'] },
                        { $ne: ['$percent_off3', null] }
                      ]
                    },
                    {
                      $round: [
                        { $multiply: ['$business_price', { $subtract: [1, { $divide: ['$percent_off3', 100] }] }] },
                        2
                      ]
                    },
                    { $toDouble: '$fixed_price3' }
                  ]
                },
              }
            },
            {
              $project: {
                qty_available: 1,
                business_price: 1,
                business_discount_type: 1,
                min_qty1: 1, max_qty1: 1,
                min_qty2: 1, max_qty2: 1,
                min_qty3: 1, max_qty3: 1,
                price_1: {
                  $cond: [
                    { $eq: ['$business_discount_type', 'fixed'] },
                    { $toDouble: '$fixed_price1' },
                    '$price_1'
                  ]
                },
                price_2: {
                  $cond: [
                    { $eq: ['$business_discount_type', 'fixed'] },
                    { $toDouble: '$fixed_price2' },
                    '$price_2'
                  ]
                },
                price_3: {
                  $cond: [
                    { $eq: ['$business_discount_type', 'fixed'] },
                    { $toDouble: '$fixed_price3' },
                    '$price_3'
                  ]
                },
              }
            },
            { $unset: ['fixed_price1', 'fixed_price2', 'fixed_price3'] }
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
