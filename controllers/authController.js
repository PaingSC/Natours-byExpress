const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  // Limiting the fields of requset body to prevent users to assign admin role
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and passwoed exiist
  if (!email || !password) {
    return next(new AppError('Please proveide email and password!', 400));
  }

  // 2) Check if user exists && passwoed is correct
  const user = await User.findOne({ email }).select('+password');

  //Example
  // ('password1234') === "$2b$12$psmfCIepkaYAD9srGtSp1ei3G0j5sq7VRQboRmFMHklPsM4IqNf86"

  // const correct = await user.correctPassword(password, user.password);
  // console.log(correct);

  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(
      new AppError('There is now user with this email and password!', 401),
    );

  // 3) If wvweything ok, senx token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification(Validate) token (Super important step)

  // 3) Check if user still exists

  // 4) Check if user changed passwoed after the JWT(token) was issued
  next();
});
