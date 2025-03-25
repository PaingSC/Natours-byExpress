// import express from 'express';
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
// const { dirname } = require('path');

const app = express();

// 1| Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Own middleware
app.use((req, res, next) => {
  console.log('Hello from the middle ware! 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Handlers
// Get all Tours (get request)
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    tours,
  });
};

// Get a Tour (Responding to Url parameters(/:variables))
const getATour = (req, res) => {
  const tourId = req.params.id * 1; // Making it into a number
  const tour = tours.find((tour) => tour.id === tourId);
  // if (tourId > tours.length - 1) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    tour,
  });
};

// Updating a tour (patch request)
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here..>',
    },
  });
};

// Deleting a Tour
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  // res.send('Done');
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// User Route Handlers
const getAllUsers = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res, next) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// 3 |Routes
// 3.1 |Tours Routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getATour).patch(updateTour).delete(deleteTour);

// 3.2 |Users Routes
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4| Server
const port = 3000;
const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
