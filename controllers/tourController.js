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
      // query = query.sort('-createdAt');
      query = query.sort('name');
    }

    // III) Limiting Fields
    // Example fields -> name, duration, difficulty, price
    // expected query string =>
    // query = query.select('name duration, difficulty, price)
    if (req.query.fields) {
      const fields = req.query.fields.split('%').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // IV) Pagination
    // page1&limit=3
    // Example pagination => page=2&limit=10
    // 1-10 docs for page1, 11-20 docs for page2, 21-30 docs for page3 and so on...
    // use skip() and limit() methods
    // example => query = query.skip(10).limit(10) for "page=2&limit=10"

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exit');
    }

    // console.log(query);
    // const query = Tour.find(queryObj);
    // const query = Tour.find(JSON.parse(queryStr));

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // query = query.sort().select().skip().limit()
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
