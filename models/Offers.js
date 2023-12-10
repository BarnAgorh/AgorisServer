const mongoose = require('mongoose')

const OffersSchema = new mongoose.Schema({
   vendorId: {
    type: mongoose.Schema.ObjectId,
    required: true
   },
   userId: {
    type: mongoose.Schema.ObjectId,
    required: true
   },
   productId: {
      type: mongoose.Schema.ObjectId,
      required: true
     },
   productTitle: {
    type: String, 
    required: true
   },
   firstName: {
    type: String, 
    required: true
   },
   lastName: {
    type: String, 
    required: true
   },
   offerAmount: {
    type: String,
    required: true
   },
   image: {
    type: String,
    required: true
   },
   userPhoneNumber: {
    type: String,
    required: true
   },
   createdAt: {
      type: Date,
      default: Date.now()
   }
})

module.exports = mongoose.model('Offers', OffersSchema)