const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
   addProductToWishlist,
   getMyWishlist,
   removeFromMyWishlist,
//    removeAllFromWishlist
} = require('../controllers/wishlist')

router.post('/create', protect, addProductToWishlist)
router.post('/my-wishlist', protect, getMyWishlist)
router.post('/remove-one', protect, removeFromMyWishlist)
// router.delete('/remove-all', protect, removeAllFromWishlist)

module.exports = router