require('dotenv').config({ path: "./config.env" })
const express = require('express')
const mongoose = require('mongoose')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()
app.use(express.json())
// Connect to the database within a try-catch block
try {
  mongoose.connect(process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD)).then(() => {
    console.log(`Database Connected Successfully...`);
  });
} catch (error) {
  console.error(`Error connecting to the database: ${error.message}`);
}

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

///// Starting server

const port = 8000 || process.env.PORT
app.listen(port, () => {
  console.log(`Server Listening To Requests On Port ${port}...`);
})


