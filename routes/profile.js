const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    getMyProfile,
    updateMyProfile,
} = require('../controllers/profile')

router.post('/my-profile', protect, getMyProfile)
router.put('/update-profile', protect, updateMyProfile)

module.exports = router