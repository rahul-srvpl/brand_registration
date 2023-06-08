const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const inventoryModel = require('../../models/inventory');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = inventoryModel.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const inventoryList = await findQuery.exec();

    const count = inventoryList.length;

    const response = {
      from: paginate.skip,
      size: paginate.limit,
      count: count,
      inventoryList: inventoryList
    };

    const successMessage = "Inventory data retrieved successfully";
    logger.info(successMessage);
    console.log(successMessage); // Console log
    res.send(response);

  } catch (err) {
    const errorMessage = "Unable to get inventory: " + err.message;
    logger.error(errorMessage);
    console.log(errorMessage); // Console log
    res.status(500).send({ message: "unable to get inventory", error: err.message });
  }
};
