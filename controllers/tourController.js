const Tour = require('./../models/tourModel');

// Get all Tours (get request)
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // tours,
  });
};

// Get a Tour (Responding to Url parameters(/:variables))
exports.getATour = (req, res) => {
  const tourId = req.params.id * 1; // Making it into a number

  // const tour = tours.find((tour) => tour.id === tourId);

  // res.status(200).json({
  //   status: 'success',
  //   tour,
  // });
};

// Updating a tour (patch request)
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here..>',
    },
  });
};

// Deleting a Tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!',
    });
  }
};
