const express = require('express')
const tourController = require('../Controllers/tourController')

const router = express()

router.route('/').get(tourController.getAllTours)
router.route('/:id').
  get(tourController.getTour).
  post(tourController.createTour).
  patch(tourController.updateTour).
  delete(tourController.deleteTour)

module.exports = router