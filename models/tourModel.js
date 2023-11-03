const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'tour must have a name'],
    trim: true,
    maxlength: [40, "A tour name must have less or equal then 40 characters"],
    minlength: [10, "A tour name must have more or equal then 10 characters"]
  },
  price: {
    type: Number,
    required: [true, 'tour must have a price']
  },
  duration: {
    type: Number,
    required: [true, 'tour must have a duration']
  },
  difficulty: {
    type: String,
    required: [true, 'tour must have a difficullty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: "Difficulty is either: easy, medium, difficult"
    }
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
    set: (val) => +val.toFixed(1),
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour