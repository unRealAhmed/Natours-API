const Review = require("../models/reviewModel");
const resourceController = require("./resourceController");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = resourceController.getAll(Review)
exports.createReview = resourceController.createOne(Review)
exports.getReview = resourceController.getOne(Review);
exports.updateReview = resourceController.updateOne(Review);
exports.deleteReview = resourceController.deleteOne(Review);
