const express = require('express');
const morgan = require('morgan');
// const { dirname } = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1| Middlewares
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
//   console.log(process.env.NODE_ENV);
// }

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Own middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middle ware! 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 |Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
