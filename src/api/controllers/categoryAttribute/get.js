const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryAttributeModel = require('../../models/categoryAttribute');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = categoryAttributeModel.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const categoryList = await findQuery.exec();

    const count = categoryList.length;

    const response = {
      from: paginate.skip,
      size: paginate.limit,
      count: count,
      categoryList: categoryList
    };

    const logMessage = `Retrieved category list: ${JSON.stringify(response)}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send(response);
  } catch (err) {
    const errorMessage = `Error occurred while retrieving category list: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": errorMessage });
  }
};
