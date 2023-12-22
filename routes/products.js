const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    getAllProducts,
    getSingleProduct,
    getProductsInCategory,
    makeOffer,
    chatSeller,
    chatHistory
} = require('../controllers/products')

router.post('/all', protect, getAllProducts)
router.post('/product-details', protect, getSingleProduct)
router.post('/category-products', protect, getProductsInCategory)
router.post('/make-offer', protect, makeOffer)
router.post('/chat-seller', protect, chatSeller)

module.exports = router