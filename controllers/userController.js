const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// User Route Handlers
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status('200').json({
    status: 'success',
    numberOfUsers: users.length,
    data: {
      users,
    },
  });
});

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
