const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = productAwardModel.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const productAwardList = await findQuery.exec();

    const count = productAwardList.length;

    console.log(`Retrieved ${productAwardList.length} product awards`);
    res.send({ from: paginate.skip, size: paginate.limit, count: count, productAwardList });

  } catch (err) {
    const errorMessage = `Failed to get product awards: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": err.message });
  }
};
