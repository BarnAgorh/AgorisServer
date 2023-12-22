const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    getMyStoreItems,
} = require('../controllers/my_store')

router.post('/my-store', protect, getMyStoreItems)

module.exports = router