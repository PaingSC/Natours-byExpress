const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// const { dirname } = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1| Global Middlewares
// 1. Set security HTTP headers
app.use(helmet());

// 2. Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
//   console.log(process.env.NODE_ENV);
// }

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// 4. Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

// 5. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 6. Data Sanitization against XSS
app.use(xss());

// 7. Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// 5. Serving static files
app.use(express.static(`${__dirname}/public`));

// 2| Own middlewares
// app.use((req, res, next) => {
//   console.log('Hello from the middle ware! 👋');
//   next();
// });

// 2.1. Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  // console.log(req.headers);

  next();
});

// 3 |Routes (Mounting routes)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
