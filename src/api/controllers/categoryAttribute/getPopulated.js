const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');
const mquery = require('express-mquery');

exports.getPopulated = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = categoryAttributeModel.find(filter);
    findQuery.populate({ path: 'attribute_id' });
    findQuery.populate({ path: 'category_id' });
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);
    findQuery.lean();

    const categoryList = await findQuery.exec();

    const count = categoryList.length;

    const response = {
      from: paginate.skip,
      size: paginate.limit,
      count: count,
      categoryList: categoryList
    };

    const logMessage = `Retrieved populated categories: ${JSON.stringify(response)}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send(response);
  } catch (err) {
    const errorMessage = `Failed to get populated categories: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": "Failed to get populated categories", error: err });
  }
};
