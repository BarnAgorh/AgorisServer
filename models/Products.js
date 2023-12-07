const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
   vendorId: {
    type: mongoose.Schema.ObjectId,
    required: true
   },
   title: {
    type: String, 
    required: true
   },
   category: {
    type: String,
    required: true
   },
   subCategory: {
    type: String,
    required: true
   },
   negotiable: {
    type: Boolean,
    required: true
   },
   price: {
    type: String,
    required: true
   },
   images: {
    type: [String],
    required: true
   },
   vendorPhoneNumber: {
    type: String,
    required: true
   },
   dateListed: {
    type: Date,
    default: Date.now()
   },
   description: {
    type: String,
    required: true
   },
   brand: {
    type: String,
    required: true
   },
   model: {
    type: String,
    required: true
   },
   color: {
    type: String,
    required: true
   },
   type: {
    type: String,
    required: true
   }
})

module.exports = mongoose.model('Products', ProductsSchema)