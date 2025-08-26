const Review = require('../models/revewModel');
const factory = require('./handlerFactory');

// Get All Reviews
exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) {
//     filter = { tour: req.params.tourId };
//   }

//   const reviews = await Review.find(filter);

//   if (!reviews) return next(new AppError('No review found with this link'));

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// Get A review
exports.getAReview = factory.getOne(Review);

// Creating a Review
exports.setTourUserIds = (req, res, next) => {
  // Allowing nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createAReview = factory.createOne(Review);
// exports.createAReview = catchAsync(async (req, res, next) => {
//   // Allowing nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

//   const review = await Review.create(req.body);

//   if (!review) return next(new AppError('The request body is empty!'));

//   res.status('201').json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// Update one Review
exports.updateAReview = factory.updateOne(Review);

// Deleting a Review
exports.deleteAReview = factory.deleteOne(Review);
