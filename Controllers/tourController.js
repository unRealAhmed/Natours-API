const Tour = require('../models/tourModel')
const APIFeatures = require('../utilities/apiFeatures')

exports.getAllTours = async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query).filtering()
  const tours = await features.query
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
}
exports.getTour = (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Tour Here...."
  })
}

exports.createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTour
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};


exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


exports.deleteTour = async (req, res, next) => {

  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
}