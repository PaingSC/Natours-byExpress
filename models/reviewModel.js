const mongoose = require('mongoose');
const Tour = require('./tourModel');
// const User = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Populating
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: ['tour', 'user'],
//     select: 'name photo',
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  // Populate chain
  // this.populate({
  //   path: 'tour',
  //   select: 'name ',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // "this" keyword represents the current Model
  // In this case "this" = "Review" Moelw
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // console.log(stats);

  // Saving the statistics to the specific(current) tour
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

// Call the statics method after the new review is created!
// In this case post for after saving
reviewSchema.post('save', function () {
  // This points to current review document
  // "constructor" is the Model who created that document
  this.constructor.calcAverageRatings(this.tour);
  // next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST /tour/tour-id/reviews
// POST /tour/30378273847/reviews

// GET /tour/tour-id/reviews
// GET /tour/30378273847/reviews

// GET /tour/tour-id/reviews/review-id
// GET /tour/30378273847/reviews/983781237
