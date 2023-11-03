const mongoose = require('mongoose');
const slugify = require('slugify');

// Create a new mongoose schema for the tour
const tourSchema = new mongoose.Schema({
  // Tour name
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name'],
    trim: true,
    maxlength: [40, 'A tour name must have less or equal to 40 characters'],
    minlength: [10, 'A tour name must have more or equal to 10 characters'],
  },
  // Slug for the tour name
  slug: String,
  // Tour price
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  // Tour duration
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  // Tour difficulty
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  // Maximum group size for the tour
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  // Average ratings for the tour
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => +val.toFixed(1),
  },
  // Number of ratings for the tour
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  // Discounted price for the tour
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below the regular price',
    },
  },
  // Summary of the tour
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  // Description of the tour
  description: {
    type: String,
    trim: true,
  },
  // Cover image for the tour
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  // Additional images for the tour
  images: [String],
  // Tour creation date
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  // Start dates for the tour
  startDates: [Date],
  // Secret tour flag
  secretTour: {
    type: Boolean,
    default: false,
  },
});

// Pre-save middleware to create a slug for the tour based on its name
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Pre-find middleware to exclude secret tours from the query results
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Create a mongoose model for the tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
