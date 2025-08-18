const Review = require('../models/revewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) return next(new AppError('No review found with this link'));

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createAReview = catchAsync(async (req, res, next) => {
  // Allowing nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  if (!review) return next(new AppError('The request body is empty!'));

  res.status('201').json({
    status: 'success',
    data: {
      review,
    },
  });
});
