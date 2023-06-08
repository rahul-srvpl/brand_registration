const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const userModel = require('../../models/user_b2b');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = 'createdAt' } = req.mquery;
    const count = await userModel.countDocuments(filter);

    const findQuery = userModel.find(filter);
    findQuery.limit(paginate.limit);
    findQuery.skip(paginate.skip);
    findQuery.sort(sort);

    // Exclude the password, refreshToken, resetToken, and resetTokenExpiration fields
    findQuery.select('-password -refreshToken -resetToken -resetTokenExpiration');

    const userList = await findQuery.exec();

    res.send({ from: paginate.skip, size: paginate.limit, count: count, userList });

  } catch (err) {
    res.status(500);
    res.send({ "message": "unable to get users", error: err });
  }
};