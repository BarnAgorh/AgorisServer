const express = require('express')
const router = express.Router()

const {
    registerUser,
    sendVerifyEmailOTP,
    verifyEmail,
    loginUser,
    forgotPassword,
    changePassword
} = require('../controllers/auth')

router.post('/register', registerUser)
router.post('/send-verify-email', sendVerifyEmailOTP)
router.post('/verify-email', verifyEmail)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.post('/change-password', changePassword)

module.exports = router