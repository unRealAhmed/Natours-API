const multer = require('multer')
const sharp = require('sharp')
const Tour = require('../models/tourModel')
const asyncHandler = require('../utilities/asyncHandler')
const resourceController = require('./resourceController')
const AppError = require('../utilities/appErrors')


exports.getAllTours = resourceController.getAll(Tour)
exports.getTour = resourceController.getOne(Tour)
exports.createTour = resourceController.createOne(Tour)
exports.updateTour = resourceController.updateOne(Tour)
exports.deleteTour = resourceController.deleteOne(Tour)

///////

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Combined upload middleware for image cover and images
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// Combined image processing middleware
exports.resizeTourImages = asyncHandler(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  const { id } = req.params;

  // 1) Cover image
  req.body.imageCover = `tour-${id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});


exports.getTopFiveCheapestTours = asyncHandler(async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  next();
});

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

exports.getMonthlyPlan = asyncHandler(async (req, res, next) => {

  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    // Unwind the startDates array to get one document per start date
    {
      $unwind: "$startDates",
    },
    // Match tours within the specified year
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // Group tours by month, count the number of tours, and collect tour details
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: {
            name: "$name",
            imageCover: "$imageCover",
            description: "$description",
            ratingsAverage: "$ratingsAverage",
            duration: "$duration",
            difficulty: "$difficulty",
            summary: "$summary",
            locations: "$locations",
            maxGroupSize: "$maxGroupSize",
            price: "$price",
            ratingsQuantity: "$ratingsQuantity",
            id: "$_id",
          },
        },
      },
    },
    // Sort the results by month
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: plan,
  });
});
