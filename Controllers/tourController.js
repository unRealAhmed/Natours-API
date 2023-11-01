exports.getAllTours = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "All Tours Here..."
  })
}
exports.getTour = (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Tour Here...."
  })
}

exports.createTour = (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Created Tour Here...."
  })
}

exports.updateTour = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Updated Tour Here...."
  })
}

exports.deleteTour = (req, res, next) => {
  res.status(204).json({
    status: "success",
    data: null
  })
}