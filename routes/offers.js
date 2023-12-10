const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    getMyOffers
} = require('../controllers/offers')

router.post('/my-offers', protect, getMyOffers)

module.exports = router