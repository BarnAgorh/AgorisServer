const mongoose = require('mongoose')

const ReviewsSchema = new mongoose.Schema({
   vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true
   },
   productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true
   },
   message: {
    type: String, 
    required: true
   },
   createdAt: {
      type: Date,
      default: Date.now()
   }
})

module.exports = mongoose.model('Reviews', ReviewsSchema)