const { promisify } = require('util')
const jwt = require('jsonwebtoken')
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

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Get the token from the request's authorization header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 3) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // 4) Check if the user associated with the token still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        401
      )
    );
  }

  const tokenIssuedAt = decoded.iat;

  // 5) Check if the user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
    return next(
      new AppError('User recently changed the password! Please log in again.', 401)
    );
  }
  // Grant access to the protected route by attaching the user object to the request
  req.user = currentUser;
  next();
});
