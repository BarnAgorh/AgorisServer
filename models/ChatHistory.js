const mongoose = require('mongoose')

const ChatHistorySchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.ObjectId,
    required: true
   },
   vendorId: {
    type: mongoose.Schema.ObjectId,
    required: true
   }
})

module.exports = mongoose.model('ChatHistory', ChatHistorySchema)