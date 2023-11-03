const express = require('express');
const tourController = require('../Controllers/tourController');

const router = express.Router();

// Define routes for the Tours
router.route('/tours-Stats').get(tourController.getTourStatistics)

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
