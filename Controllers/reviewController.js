const asyncHandler = require("../utilities/asyncHandler");
const Review = require("../models/reviewModel");

// Get all reviews or reviews for a specific tour
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  // Define query options to filter by tour if specified
  let queryOptions = {};
  if (req.params.tourId) {
    queryOptions = { tour: req.params.tourId };
  }

  const reviews = await Review.find(queryOptions).select('-__v');

  res.status(200).json({
    status: "success",
    length: reviews.length,
    data: reviews,
  });
});

// Create a new review for a tour
exports.createReview = asyncHandler(async (req, res, next) => {
  // Set defaults for tour and user if not provided in the request
  req.body.tour = req.body.tour || req.params.tourId;
  req.body.user = req.body.user || req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: review,
  });
});
