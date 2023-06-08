const logger = require('../../../config/logger');
const userModel = require('../../models/user_b2b');

exports.removeById = async (req, res, next) => {
  const userId = req.params.id;

  userModel.findByIdAndRemove({ _id: userId }, function (err) {
    if (err) {
      console.log("unable to remove by ID", err)
      res.status(500);
      res.send({ err });
      return
    }
    res.send({ "success": true });
  })
};