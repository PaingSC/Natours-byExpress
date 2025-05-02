const Tour = require('../models/tourModel');

// Get all Tours (get request)
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // IA) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // IB) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // { difficylty: 'easy', duration: { $gte: 5 }}
    // { difficulty: 'easy', duration: { gte: '5' } }
    // { difficulty: 'easy', duration: { '$gte': '5' } }
    // gte, gt, lte, lt

    // console.log(req.query, queryObj, JSON.parse(queryStr), req.params);

    // EXECUTE QUERY
    let query = Tour.find(JSON.parse(queryStr));
    // console.log(query);

    // II) Sorting
    // console.log(req.query.sort);
    if (req.query.sort) {
      const sortBy = req.query.sort.split('%').join(' ');
      query = query.sort(sortBy);
      // sort("price ratingsAverage")
    } else {
      query = query.sort('-createdAt');
    }
    // console.log(query);
    // const query = Tour.find(queryObj);
    // const query = Tour.find(JSON.parse(queryStr));

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const tours = await query;
    // console.log(tours);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Get a Tour (Responding to Url parameters(/:variables))
exports.getATour = async (req, res) => {
  try {
    // Tour.findOne({ _id: req.params.id})
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Updating a tour (patch request)
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!',
    });
  }
};

// Deleting a Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid',
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = newTour({})
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
      message: err,
    });
  }
};
