const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createAReview,
  );

router
  .route('/:id')
  .get(reviewController.getAReview)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    reviewController.updateAReview,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteAReview,
  );

module.exports = router;
