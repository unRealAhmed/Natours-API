require('dotenv').config({ path: './config.env' });
const express = require('express');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const errorController = require('./Controllers/errorController');

const app = express();

// Middleware
app.use(express.json({ limit: '100kb' }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
    ],
  })
);
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
/////

app.all("*", (req, _, next) => {
  const err = new Error(`Can't Find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

app.use(errorController)

/////
module.exports = app