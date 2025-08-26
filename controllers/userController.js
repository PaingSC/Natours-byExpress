const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });

//   return newObj;
// };

const filterObj = (obj, ...allowedFields) =>
  Object.keys(obj).reduce((acc, key) => {
    if (allowedFields.includes(key)) acc[key] = obj[key];

    return acc;
  }, {});

// User Route Handlers

// Get All User
exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status('200').json({
//     status: 'success',
//     numberOfUsers: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated!
  const filterBody = filterObj(req.body, 'name', 'email');
  // result => filterBody = {name: "New User Name", email: "new@something.com"}

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'successful',
    data: null,
  });
});

exports.createUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

// Get One User
exports.getAUser = factory.getOne(User);
// exports.getUser = (req, res, next) => {
//   res.status('500').json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// 🔥🔥🔥 Do not attempt to update passwords with this!
exports.updateUser = factory.updateOne(User);

// Deleting a User
// exports.deleteUser = (req, res, next) => {
//   res.status('500').json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

exports.deleteAUser = factory.deleteOne(User);
