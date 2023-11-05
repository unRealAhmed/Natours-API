const asyncHandler = require('../utilities/asyncHandler');
const AppError = require('../utilities/appErrors');
const APIFeatures = require('../utilities/apiFeatures');

// This factory function generates a middleware for handling generic "get all" requests for any resource.
exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    // Define the filter based on the request parameters (tourId for reviews on tour).
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Create an APIFeatures instance to handle filtering, sorting, field selection, and pagination.
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter() // Apply filters based on query parameters.
      .sort() // Apply sorting based on query parameters.
      .paginate() // Select a subset of fields to return (if specified).
      .selectFields(); // Apply pagination based on query parameters.

    const data = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data,
      },
    });
  });

// This factory function generates a middleware for handling generic "get one" requests for any resource
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {

    const query = Model.findById(req.params.id);

    // Execute the query to retrieve the document.
    const doc = await query;

    // Handle the case when no document is found with the provided ID.
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // Send the retrieved document as a response.
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// This factory function generates a middleware for handling generic "create one" requests for any resource
exports.createOne = Model =>
  asyncHandler(async (req, res, next) => {
    // 1. Create a new document using the request body
    const doc = await Model.create(req.body);

    // 2. Send a success response with the created data
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// This factory function generates a middleware for handling generic "update one" requests for any resource
exports.updateOne = Model =>
  asyncHandler(async (req, res, next) => {
    // 1. Find and update the document
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validators on update
    });

    // 2. Handle the case when no document is found
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 3. Send a success response with the updated data
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// This factory function generates a middleware for handling generic "delete one" requests for any resource
exports.deleteOne = Model =>
  asyncHandler(async (req, res, next) => {
    // 1. Find and delete a document by its ID
    const doc = await Model.findByIdAndDelete(req.params.id);

    // 2. If no document is found, handle it as an error
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // 3. Send a success response with no data (204 status code)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });