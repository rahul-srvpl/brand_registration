const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = categoryModel.find(filter)
      .limit(paginate.limit)
      .skip(paginate.skip)
      .sort(sort)
      .select(select);

    const categoryList = await findQuery.exec();

    const count = categoryList.length;

    res.send({ from: paginate.skip, size: paginate.limit, count, categoryList });

  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
    res.status(500).send({ "message": err.message });
  }
};
