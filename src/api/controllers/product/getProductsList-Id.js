const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const mquery = require('express-mquery');

exports.getProductsListId = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = { createdAt: -1 }, select } = req.mquery;
    const { country, award, sub_category, child_category, parent_category, seller } = req.query;

    if (filter._id) {
      filter._id.$eq = new mongoose.Types.ObjectId(filter._id.$eq);
    }

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
          from: 'sellers',
          localField: 'seller_id',
          foreignField: '_id',
          pipeline: [
            { $project: { fullname: 1 } }
          ],
          as: 'seller'
        }
      },
      { '$limit': paginate.limit },
      { '$skip': paginate.skip },
      { '$sort': sort }
    ];

    if (select) {
      pipeline.push({ '$project': select });
    }

    pipeline.push({
      '$addFields': {
        'list_price': { $toDouble: '$list_price' },
        'max_retail_price': { $toDouble: '$max_retail_price' },
      }
    });

    // Dynamic $match stage based on condition
    if (award) {
      pipeline.push({
        $match: {
          'awards._id': mongoose.Types.ObjectId(award)
        }
      });
    }
    if (seller) {
      pipeline.push({
        $match: {
          'seller._id': mongoose.Types.ObjectId(seller)
        }
      });
    }
    if (country) {
      pipeline.push({
        $match: {
          'country._id': mongoose.Types.ObjectId(country)
        }
      });
    }
    if (child_category) {
      pipeline.push({
        $match: {
          'child_category._id': mongoose.Types.ObjectId(child_category)
        }
      });
    }
    if (sub_category) {
      pipeline.push({
        $match: {
          'sub_category._id': mongoose.Types.ObjectId(sub_category)
        }
      });
    }
    if (parent_category) {
      pipeline.push({
        $match: {
          'parent_category._id': mongoose.Types.ObjectId(parent_category)
        }
      });
    }

    const findQuery = productModel.aggregate(pipeline);

    const productList = await findQuery.exec();

    const count = productList.length;

    res.send({ from: paginate.skip, size: paginate.limit, count: count, productList });

  } catch (err) {
    logger.log(err.message);
    res.status(500).send(err.message);
  }
};