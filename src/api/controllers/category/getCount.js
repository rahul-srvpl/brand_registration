const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.getCount = async (req, res, next) => {
  try {
    const parentCount = await categoryModel.countDocuments({ category_type: { $eq: 'parent' } });
    const subCount = await categoryModel.countDocuments({ category_type: { $eq: 'sub' } });
    const childCount = await categoryModel.countDocuments({ category_type: { $eq: 'child' } });

    res.send({ parent: parentCount, sub: subCount, child: childCount });

  } catch (err) {
    logger.error(`Failed to get category count: ${err.message}`);
    console.log(`Failed to get category count: ${err.message}`);
    res.status(500).send({ "message": err.message });
  }
};
