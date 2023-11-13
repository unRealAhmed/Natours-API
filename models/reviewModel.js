const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

// Calculate and update average ratings and ratings quantity for a specific tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // Aggregate reviews to calculate average ratings
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // Update the tour with calculated ratings
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    // If there are no reviews, set default ratings
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // Calculate and update ratings when a review is saved
  this.constructor.calcAverageRatings(this.tour);
});

// Middleware executed before finding and updating a review, stores original review
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.originalReview = await this.model.findOne(this.getQuery()); //retrieve the current review
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // Calculate and update ratings after finding and updating a review
  await this.originalReview.constructor.calcAverageRatings(this.originalReview.tour);
});


// Virtual populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;