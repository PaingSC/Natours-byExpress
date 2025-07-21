const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
  console.log(newObj);
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This rout is not for password update. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated!
  const filterBody = filterObj(req.body, 'name', 'email');

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  // user.name = 'Paing';
  // await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
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
