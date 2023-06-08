const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');
const awardModel = require('../../models/award');

exports.getCount = async (req, res, next) => {
  try {
    const { filter = {}, paginate, sort = { createdAt: -1 } } = req.mquery;

    const pipeline = [
      { '$match': filter },
      {
        $lookup: {
          from: 'product_awards',
          localField: '_id',
          foreignField: 'award_id',
          as: 'product_awards'
        }
      },
      {
        $project: {
          award_name: 1,
          image: 1,
          award_description: 1,
          count: { $size: '$product_awards' }
        }
      },
      { '$limit': paginate.limit },
      { '$skip': paginate.skip },
      { '$sort': sort }
    ];

    const findQuery = awardModel.aggregate(pipeline);

    const awardList = await findQuery.exec();
    const count = awardList.length;
    const totalCount = await awardModel.countDocuments({});

    console.log(`Retrieved award count: ${count}`);
    console.log(`Total award count: ${totalCount}`);
    res.send({ from: paginate.skip, size: paginate.limit, count: count, total_count: totalCount, data: awardList });

  } catch (err) {
    const errorMessage = `Failed to get award count: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ "message": err.message });
  }
};
