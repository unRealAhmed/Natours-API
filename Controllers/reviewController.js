const Review = require("../models/reviewModel");
const { getAll, getOne, updateOne, deleteOne } = require('./resourceController');
const AppError = require("../utilities/appErrors");
const asyncHandler = require("../utilities/asyncHandler");


exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = asyncHandler(async (req, res, next) => {
  const tourtId = req.body.tour;
  const { user } = req;

  // Check if the product ID is present in the request body
  if (!req.body.tour) {
    throw new AppError('tour ID is required for creating a review.', 400);
  }

  // Check if the user has already reviewed the product
  const existingReview = await Review.findOne({ product: tourtId, user: user._id });

  if (existingReview) {
    throw new AppError('You have already reviewed this tour.', 400);
  }

  // If not, proceed with creating the review
  const newReview = await Review.create({
    ...req.body,
    user: user._id,
    tour: tourtId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});