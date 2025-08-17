const TModel = require('../models/testModel');

exports.getAllTests = async (req, res, next) => {
  const Tests = await TModel.find();

  res.status(200).json({
    status: 'success',
    Tests,
  });
};
