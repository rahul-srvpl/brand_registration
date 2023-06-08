const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');
const mquery = require('express-mquery');

exports.getPopulated = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const count = await productAwardModel.countDocuments(filter);

    const findQuery = productAwardModel.find(filter);
    findQuery.populate({ path: 'product_id' });
    findQuery.populate({ path: 'award_id' });
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);
    findQuery.lean();

    const productAwardList = await findQuery.exec();

    console.log(`Retrieved populated product awards: ${productAwardList.length}`);
    res.send({ from: paginate.skip, size: paginate.limit, count: count, productAwardList });
  } catch (err) {
    const errorMessage = `Failed to get populated results: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "Failed to get populated results", error: err.message });
  }
};
