const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');
const mquery = require('express-mquery');

exports.getPopulated = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = categoryModel.find(filter);
    findQuery.populate({ path: 'parent_category_id' });
    findQuery.populate({ path: 'sub_category_id' });
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const categoryList = await findQuery.exec();

    const count = categoryList.length;

    res.send({ from: paginate.skip, size: paginate.limit, count: count, categoryList });
  } catch (err) {
    logger.error(`Failed to get populated categories: ${err.message}`);
    console.log(`Failed to get populated categories: ${err.message}`);
    res.status(500).send({ "message": "Failed to get populated categories", error: err });
  }
};
