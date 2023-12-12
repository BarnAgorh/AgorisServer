const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    createdAt: Date,
})

module.exports = mongoose.model("Wishlist", WishlistSchema)