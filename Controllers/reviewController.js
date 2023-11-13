const Review = require("../models/reviewModel");
const { getAll, createOne, getOne, updateOne, deleteOne } = require('./resourceController');


exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = getAll(Review);
exports.createReview = createOne(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);

