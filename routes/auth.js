const express = require('express')
const router = express.Router()

const {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    changePassword
} = require('../controllers/auth')

router.post('/register', registerUser)
router.post('/verify-email', verifyEmail)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.put('/change-password', changePassword)

module.exports = router