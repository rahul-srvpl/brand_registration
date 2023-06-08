const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productModel = require('../../models/product');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;
    
    const findQuery = productModel.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const productList = await findQuery.exec();

    const count = productList.length;

    console.log(`Products found: ${productList.length}`);
    console.log(`From: ${paginate.skip}, Size: ${paginate.limit}, Count: ${count}`);

    res.send({ from: paginate.skip, size: paginate.limit, count: count, productList });

  } catch (err) {
    const errorMessage = `Unable to get product: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500);
    res.send({ "message": "unable to get product", error: err.message  });
  }
};
