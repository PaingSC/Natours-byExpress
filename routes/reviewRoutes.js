const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createAReview,
  );

router
  .route('/:id')
  .get(reviewController.getAReview)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateAReview,
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteAReview,
  );

module.exports = router;
