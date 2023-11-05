const asyncHandler = require("../utilities/asyncHandler");
const Review = require("../models/reviewModel");

exports.getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res
    .status(200)
    .json({
      status: "success",
      length: reviews.length,
      data: reviews,
    })
});

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.tour = req.body.tour || req.params.tourId;
  req.body.user = req.body.user || req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: review,
  });
});