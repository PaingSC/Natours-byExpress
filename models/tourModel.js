const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [60, 'A tour name must have less or equal then 60 characters'],
      minlength: [10, 'A tour name must have equal or more then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Atour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The Difficulty is either: easy, medium or difficult!',
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // the "this" keyword here is the current doc on creating phase
          // not going to work on updating the doc
          // the function parameter(val) is the enter amount of "priceDiscount"
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should below the regular price!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a disctiption'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('nameUppercase').get(function () {
  return this.name.toUpperCase();
});

// Document Middleware(preHook): runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log(this);
//   next();
// });

// postHooks
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
// ⚠️⚠️⚠️ In the regular callback functions of pre and post "saveHooks",
// (document middleware) "this" keyword is the current document itself. ⚠️⚠️⚠️

// Query Middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // console.log(this);
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Querry took ${Date.now() - this.start} milliseconds.`);
  // console.log(docs);
  next();
});
// ⚠️⚠️⚠️ In the regular callback functions of pre and post "findHooks"
// (Query Middleware),"this" keyword is the the current query object . ⚠️⚠️⚠️

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
