// 3.1 |Tours Routes
const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
