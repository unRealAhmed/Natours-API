const asyncHandler = require('../utilities/asyncHandler')
const User = require('../models/userModel')
const createToken = require('../utilities/createToken')
const AppError = require('../utilities/appErrors')


exports.signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  newUser.password = undefined
  const token = createToken(newUser._id)

  res.status(201).json({
    message: 'success',
    data: {
      token,
      newUser
    }
  })
})

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  // Find the user by email and include the password and active fields
  const user = await User.findOne({ email }).select('+password +active');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await user.passwordMatching(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = createToken(user._id);
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
  });
});
