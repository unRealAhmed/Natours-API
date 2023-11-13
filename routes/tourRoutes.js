const express = require('express');
const {
  getTourStatistics,
  getMonthlyPlan,
  getTopFiveCheapestTours,
  getAllTours,
  createTour,
  getTour,
  uploadTourImages,
  resizeTourImages,
  updateTour,
  deleteTour,
} = require('../Controllers/tourController');
const {
  protect,
  restrictTo,
} = require('../Controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// Nested route for reviews
router.use('/:tourId/reviews', reviewRouter);

// Route for tour statistics
router.route('/tours-stats').get(getTourStatistics);

// Route for monthly plan
router.route('/monthly-plan/:year').get(
  protect,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
);

// Route for top 5 cheapest tours
router.route('/top-5-cheapest').get(
  getTopFiveCheapestTours,
  getAllTours
);

// Routes for CRUD operations on tours
router.route('/')
  .get(getAllTours)
  .post(
    protect,
    restrictTo('admin', 'lead-guide'),
    createTour
  );

router.route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
