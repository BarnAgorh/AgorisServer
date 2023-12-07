const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    getAllProducts,
    getProductsInCategory,
    makeOffer
} = require('../controllers/products')

router.post('/all', protect, getAllProducts)
router.post('/category-products', protect, getProductsInCategory)
router.post('/make-offer', protect, makeOffer)

module.exports = router