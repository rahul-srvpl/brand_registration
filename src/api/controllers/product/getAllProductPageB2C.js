const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const inventoryModel = require('../../models/inventory');
const mquery = require('express-mquery');

exports.getAllProductPageB2C = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = { createdAt: -1 }, select } = req.mquery;
    const { country, award, sub_category, child_category, parent_category, seller } = req.query;

    if (filter._id) {
      filter._id.$eq = new mongoose.Types.ObjectId(filter._id.$eq);
    }

    filter.approval_status = { '$eq': 'approved' };
    filter.status = { '$eq': 'active' };

    const pipeline = [
      { '$match': filter },
      {
        '$lookup': {
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

    if (select) {
      pipeline.push({ '$project': select });
    }

    if (country) {
      pipeline.push({
        $match: {
          'country.country_name': country
        }
      });
    }

    if (award) {
      pipeline.push({
        $match: {
          'awards.award_name': award
        }
      });
    }

    if (sub_category) {
      pipeline.push({
        $match: {
          'sub_category.category_name': sub_category
        }
      });
    }

    if (child_category) {
      pipeline.push({
        $match: {
          'child_category.category_name': child_category
        }
      });
    }

    if (parent_category) {
      pipeline.push({
        $match: {
          'parent_category.category_name': parent_category
        }
      });
    }

    if (seller) {
      pipeline.push({
        $match: {
          'seller.fullname': seller
        }
      });
    }

    const productList = await productModel.aggregate(pipeline)
      .sort(sort)
      .skip(paginate.skip)
      .limit(paginate.limit);

    const count = productList.length;

    res.send({
      from: paginate.skip,
      size: paginate.limit,
      count: count,
      productList: productList
    });
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
    next(err);
  }
};
