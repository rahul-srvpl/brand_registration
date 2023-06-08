const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const variationModel = require('../../models/variation');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
    try {
        const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;

        const findQuery = variationModel.find(filter);
        findQuery.limit(paginate.limit);
        findQuery.skip(paginate.skip);
        findQuery.sort(sort);
        findQuery.select(select);

        const variationList = await findQuery.exec();

        const count = variationList.length;

        const logMessage = "Variation data retrieved successfully:";
        const logData = {
            from: paginate.skip,
            size: paginate.limit,
            count: count,
            variationList
        };
        logger.info(logMessage, logData);
        console.log(logMessage, logData);

        res.send({ from: paginate.skip, size: paginate.limit, count: count, variationList });

    } catch (err) {
        const errorMessage = "Error while getting variation data:";
        logger.error(errorMessage, err.message);
        console.log(errorMessage, err.message);
        res.status(500).send({ message: 'An error occurred while fetching variation data.', error: err.message });
    }
};
