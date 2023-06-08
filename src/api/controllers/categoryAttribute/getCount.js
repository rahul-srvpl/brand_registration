const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.getCount = async (req, res, next) => {
  try {
    const parentCount = await categoryModel.countDocuments({ category_type: { $eq: 'parent' } });
    const subCount = await categoryModel.countDocuments({ category_type: { $eq: 'sub' } });
    const childCount = await categoryModel.countDocuments({ category_type: { $eq: 'child' } });

    const response = { parent: parentCount, sub: subCount, child: childCount };

    const logMessage = `Retrieved category counts: ${JSON.stringify(response)}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send(response);
  } catch (err) {
    const errorMessage = `Error occurred while retrieving category counts: ${err}`;
    logger.error(errorMessage);
    console.log(errorMessage);
    res.status(500).send({ "message": errorMessage });
  }
};
