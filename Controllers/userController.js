const User = require("../models/userModel")
const asyncHandler = require("../utilities/asyncHandler")

exports.getAllUsers = asyncHandler(async (req, res, next) => {

  const users = await User.find()

  res.status(200).json({
    status: "success",
    data: users
  })
})
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

