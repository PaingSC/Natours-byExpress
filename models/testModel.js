const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Test Name',
  },
});

const TModel = mongoose.model('TestModel', testSchema);
module.exports = TModel;
