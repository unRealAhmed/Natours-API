const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'tour must have a name']
  },
  price: {
    type: Number,
    required: [true, 'tour must have a price']
  },
  duration: Number,
  difficulty: String
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour