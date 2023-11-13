const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/userModel")
const asyncHandler = require("../utilities/asyncHandler")
const AppError = require("../utilities/appErrors")
const { getAll, getOne, createOne, updateOne, deleteOne } = require('./resourceController');

////////// Admin Access

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.createUser = createOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

//////////

const multerStorage = multer.memoryStorage();

// Check if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // Allow the upload
    cb(null, true);
  } else {
    // Reject the upload
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Set up multer with the defined storage and file filtering
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Middleware to handle single photo upload
exports.uploadUserPhoto = upload.single('photo');

// Middleware to resize the uploaded user photo
exports.resizeUserPhoto = asyncHandler(async (req, res, next) => {
  // Check if there's no file to process
  if (!req.file) return next();

  // Generate a unique filename
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Resize the image and convert it to jpeg format with quality adjustment
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});



const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    // If the property is in the list of allowed fields, add it to the new object
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  // Set the user's ID in the request parameters for retrieving the user's data
  req.params.id = req.user.id;
  next();
};

// Update user data except for password
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

// Deactivate user
exports.deleteMe = asyncHandler(async (req, res, next) => {
  // Deactivate the user's account by updating the 'active' field to 'false'
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});