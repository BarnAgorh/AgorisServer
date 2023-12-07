const mongoose = require("mongoose")

const ChatMessageSchema = new mongoose.Schema({
    senderId: String,
    message: String,
    timeStamp: Date,
})

module.exports = mongoose.model("ChatMessageModel", ChatMessageSchema)