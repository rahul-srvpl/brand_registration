const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

    const findQuery = ProductImage.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);
    findQuery.select(select);

    const imageList = await findQuery.exec();

    const count = imageList.length;

    console.log(`Retrieved ${imageList.length} images from offset ${paginate.skip}`);
    res.send({ from: paginate.skip, size: paginate.limit, count: count, imageList });

  } catch (err) {
    const errorMessage = `Failed to get image list: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": "unable to get image list", error: err.message });
  }
};
