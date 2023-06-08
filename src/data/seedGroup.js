const mongoose = require('../config/mongoose');
const logger = require('../config/logger');
const attributeGroupModel = require('../api/models/attributeGroup');
const attributeGroupData = require('./groupData');

(async () => {
  try {
    await mongoose.connect();

    const attributeDocs = attributeGroupData.map((element) => new attributeGroupModel(element));

    await attributeGroupModel.insertMany(attributeDocs);
    console.log('All data inserted successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
})();
