// import express from 'express';
const fs = require('fs');
const express = require('express');
const { dirname } = require('path');

const app = express();

// middleware
app.use(express.json());

// I. Basic routing with 'express'
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
});

app.post(`/api/v1/tours`, (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // console.log(newId);
  const newTour = Object.assign({ id: newId }, req.body);
  // console.log(newTour);
  // res.send('Done');
  tours.push(newTour);
  // console.log(tours);
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
});

const port = 3000;
const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
