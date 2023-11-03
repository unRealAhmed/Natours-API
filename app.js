require('dotenv').config({ path: './config.env' });
const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Import and invoke the database connection function
const connectDatabase = require('./utilities/database');

connectDatabase();

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
/////
