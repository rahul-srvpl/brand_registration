const logger = require('../../../config/logger');
const categoryModel = require('../../models/category');

exports.removeById = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    await categoryModel.findByIdAndDelete(categoryId);
    res.send({ "success": true });
  } catch (err) {
    console.log(`Unable to remove by ID: ${err}`);
    logger.error(`Unable to remove by ID: ${err}`);
    res.status(500).send({ error: err.message });
  }
};
