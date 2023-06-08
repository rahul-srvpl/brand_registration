const mongoose = require('../config/mongoose');
const logger = require('../config/logger');
const attributeModel = require('../api/models/attribute');
const attributeData = require('./attributeData');

(async () => {
  try {
    await mongoose.connect();

    const attributeDocs = attributeData.map((element) => new attributeModel(element));

    await attributeModel.insertMany(attributeDocs);
    console.log('All data inserted successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
})();
