// import express from 'express';
const fs = require('fs');
const express = require('express');
const { dirname } = require('path');

const app = express();

// middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get all Tours (get request)
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getATour)
  .patch(updateTour)
  .delete(deleteTour);

// Creating Server
const port = 3000;
const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
