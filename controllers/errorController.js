//

const AppError = require('../utils/appError');

// Error Handlers
// I) name: CastError
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// II) code: 11000
const handleDuplicateFieldsDB = (err) => {
  const { name } = err.keyValue;
  const message = `Duplicate field value: "${name}". Please use another value`;
  return new AppError(message, 400);
};

// III) name: ValitionError
const handleValitionErrorDB = (err) => {
  const errorMessages = Object.values(err.errors)
    .map((error) => error.message)
    .join('. ');

  const message = `Invalid input data. ${errorMessages}`;
  return new AppError(message, 400);
};

// IV) name: JsonWebTokenError
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// V) name: TokenExpiredError
const handleJWTExpierError = () =>
  new AppError('Your Token has expired! Please log in again!', 401);

//Sending Development Errors
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    isOperational: false,
  });
};

// Sending Production Errors
// const sendErrorProd = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// };
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      isOperational: err.isOperational,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      isOperational: false,
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    if (err.name === 'CastError') console.log('This is CastError!');
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValitionErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpierError();
    sendErrorProd(err, res);
  }
};
