exports.getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "All Users Here..."
  })
}
exports.getUser = (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "User Here...."
  })
}

exports.createUser = (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "Created User Here...."
  })
}

exports.updateUser = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Updated User Here...."
  })
}

exports.deleteUser = (req, res, next) => {
  res.status(204).json({
    status: "success",
    data: null
  })
}