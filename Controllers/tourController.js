const Tour = require('../models/tourModel')
const APIFeatures = require('../utilities/apiFeatures')
const asyncHandler = require('../utilities/asyncHandler')
const AppError = require('../utilities/appErrors')

exports.getAllTours = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .selectFields()
  const tours = await features.query
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) return next(new AppError("No tour found with this ID"), 404);
  res.status(201).json({
    status: "success",
    data: {
      tour
    }
  })
})

exports.createTour = asyncHandler(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newTour
    }
  });
});


exports.updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});


exports.deleteTour = asyncHandler(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null
  })
})

exports.getTourStatistics = asyncHandler(async (req, res, next) => {
  // Calculate tour statistics
  const stats = await Tour.aggregate([
    // Match tours with a rating greater than or equal to 4.5
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    // Group and calculate statistics
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      }
    },
    // Sort the results by average price in ascending order
    {
      $sort: { avgPrice: 1 }
    },
    // Exclude the _id field from the result
    {
      $project: { _id: 0 }
    }
  ]);

  // Send the statistics as a JSON response
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
}
)