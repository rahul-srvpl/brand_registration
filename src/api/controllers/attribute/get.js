const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const attributeModel = require('../../models/attribute');
const mquery = require('express-mquery');

exports.get = async (req, res, next) => {
    try {
        const { filter = {}, paginate, sort = 'createdAt', select = '' } = req.mquery;
        
        const findQuery = attributeModel.find(filter);
        findQuery.limit(paginate.limit);
        findQuery.skip(paginate.skip);
        findQuery.sort(sort);
        findQuery.select(select);

        const attributeList = await findQuery.exec();
        const count = attributeList.length;
        
        const logMessage = "Attribute data retrieved successfully:";
        const logData = {
            from: paginate.skip,
            size: paginate.limit,
            count: count,
            attributeList: attributeList
        };
        logger.info(logMessage, logData);
        console.log(logMessage, logData);

        

        res.send({ from: paginate.skip, size: paginate.limit, count: count, attributeList: attributeList });

    } catch (err) {
        const errorMessage = "Error while getting attribute data:";
        logger.error(errorMessage, err.message);
        console.log(errorMessage, err.message);
        res.status(500).send({ message: 'An error occurred while fetching attribute data.', error: err.message });
    }
};
