const mongoose = require("mongoose")

const PasswordChangeSchema = new mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
})

module.exports = mongoose.model("PasswordChange", PasswordChangeSchema)