// 3.1 |Tours Routes
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /tour/tour-id/reviews
// POST /tour/30378273847/reviews

// GET /tour/tour-id/reviews
// GET /tour/30378273847/reviews

// GET /tour/tour-id/reviews/review-id
// GET /tour/30378273847/reviews/983781237

// Nested Route (implement review route in the tour router)
// Fix this by uisng  advanced express feature (mergeParams)
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createAReview,
//   );

// Mounting (Re-routing) '/:tourId/reviews' on reviewRouter
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getATour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// POST /tour/tour-id/reviews
// POST /tour/30378273847/reviews

// GET /tour/tour-id/reviews
// GET /tour/30378273847/reviews

// GET /tour/tour-id/reviews/review-id
// GET /tour/30378273847/reviews/983781237

// Nested Route (implement review route in the tour router)
// Fix this by uisng express advance method (mergeParams)
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createAReview,
//   );

module.exports = router;
