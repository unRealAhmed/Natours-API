const User = require("../models/userModel")
const asyncHandler = require("../utilities/asyncHandler")
const AppError = require("../utilities/appErrors")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = asyncHandler(async (req, res, next) => {

  const users = await User.find()

  res.status(200).json({
    status: "success",
    data: users
  })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    status: "success",
    message: "User Here...."
  })
})

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

exports.updateMe = asyncHandler(async (req, res, next) => {
  // 1) Check if the request includes password-related fields; if so, disallow updates
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out any unwanted fields that should not be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = (req, res, next) => {
  res.status(204).json({
    status: "success",
    data: null
  })
}

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});