const User = require('../models/userModel');

// User Route Handlers
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status('200').json({
      status: 'success',
      users,
    });
  } catch {
    res.status('500').json({
      status: 'error',
      message: 'This route is not yet defined!',
    });
  }
};

exports.createUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
