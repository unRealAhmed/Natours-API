require('dotenv').config({ path: './config.env' });
const express = require('express');
const errorController = require('./Controllers/errorController');

const app = express();

// Middleware
app.use(express.json());

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
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