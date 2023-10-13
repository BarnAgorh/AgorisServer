
const UserModel = require('../models/User')
const {totp} = require('otplib')

const {registerSchema, loginSchema} = require('../utils/validation_schema')
const sendEmail = require('../utils/email')

/***
 *  @description Create a new user 
 *  @route POST /api/v1/register
 *  @access Public
 */
exports.registerUser = async (req, res, next) => {
    try{

        const {firstName, lastName, email, password} = req.body

        const doesExist = await UserModel.findOne({email: email});
        if(doesExist) {
            return res.status(409)
                      .json({
                        success: false,
                        message: `This email ${email} is taken`
                      })  
        }

        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        })

        const token = user.getSignedJwtToken()

        if(user != null){
            return res.status(201)
                      .json({
                        success: true,
                        message: 'Registration successful',
                        user,
                        token
                      })
                      
                      try{

                        const user = await UserModel.findOne({email:req.body.email})
                        if(!user) {
                            return res.status(409)
                                      .json({
                                        success: false,
                                        message: `The email ${email} is not registered with Agoris`
                                      })  
                        }
                
                        const token = totp.generate(process.env.OTP_SECRET)
                        console.log("token\n", token)
                
                        const message = `Hello ${user.firstName}, \n\n Welcome to Agoris\n\n Please use this secure code\t${token}\t to verify your email inside the Agoris app. \n\n This code will expire in 10 minutes. \n\n\n From,\nThe Agoris Team`
                
                        try{
                            await sendEmail({
                                email: req.body.email,
                                subject: "Password Change Request",
                                message
                            })
                            return res.status(200)
                                      .json({
                                        success: true,
                                        message: "A secure code has been sent to your email"
                                      })  
                        } catch(err){
                            console.log(`err sending mail\n${err}`)
                        }
                
                    } catch(error){
                        console.log(error);
                    }          
        }

    } catch(error){
        console.log(error);
    }


}


/***
 *  @description Verify new signup's email address with otp
 *  @route POST /api/v1/verify-email
 *  @access Public
 */
exports.verifyEmail = async (req, res, next) => {
    try{

        const user = await UserModel.findOne({email:req.body.email})
        if(!user) {
            return res.status(409)
                      .json({
                        success: false,
                        message: `The email ${email} is not registered with Agoris`
                      })  
        }

        const token = totp.generate(process.env.OTP_SECRET)
        console.log("token\n", token)

        // const isValid = totp.check(token, process.env.OTP_SECRET)
        // console.log("isValid\n", isValid)

        const message = `Hello ${user.firstName}, \n\n You are seeing this message because a forgot password request was initiated on your account. \n Use this secure code\t\n ${token}\t\nto proceed to resetting your password inside the Agoris app. \n\n This code will expire in 10 minutes. \n\n\n From,\nThe Agoris Team`

        try{
            await sendEmail({
                email: req.body.email,
                subject: "Password Change Request",
                message
            })
            return res.status(200)
                      .json({
                        success: true,
                        message: "A secure code has been sent to your email"
                      })  
        } catch(err){
            console.log(`err sending mail\n${err}`)
        }

    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Logs in existing users
 *  @route POST /api/v1/login
 *  @access Public
 */
exports.loginUser = async (req, res, next) => {
    try{

        const validationResult = await loginSchema.validateAsync(req.body)

        const user = await UserModel.findOne({email: validationResult.email}).select('+password')
        if(!user) {
            return res.status(409)
                      .json({
                        success: false,
                        message: `Invalid Credentials`
                      })  
        }

        const isPasswordMatch = await user.matchPassword(req.body.password)
        if(!isPasswordMatch){
            return res.status(409)
                      .json({
                        success: false,
                        message: `Invalid Credentials`
                      })  
        }

        const token = user.getSignedJwtToken()
        console.log('jwt token\n', token)

        if(user != null){
            return res.status(200)
                      .json({
                        success: true,
                        message: 'Login successful',
                        user,
                        token
                      })  
        }

    } catch(error){
        console.log(error);
    }

}

/***
 *  @description Initiate password reset 
 *  @route POST /api/v1/forgot-password
 *  @access Public
 */
exports.forgotPassword = async (req, res, next) => {
    try{

        const user = await UserModel.findOne({email:req.body.email})
        if(!user) {
            return res.status(409)
                      .json({
                        success: false,
                        message: "Invalid Credentials"
                      })  
        }

        const token = totp.generate(process.env.OTP_SECRET)
        console.log("token\n", token)

        // const isValid = totp.check(token, process.env.OTP_SECRET)
        // console.log("isValid\n", isValid)

        const message = `Hello ${user.firstName}, \n\n You are seeing this message because a forgot password request was initiated on your account. \n Use this secure code\t\n ${token}\t\nto proceed to resetting your password inside the Agoris app. \n\n This code will expire in 10 minutes. \n\n\n From,\nThe Agoris Team`

        try{
            await sendEmail({
                email: req.body.email,
                subject: "Password Change Request",
                message
            })
            return res.status(200)
                      .json({
                        success: true,
                        message: "A secure code has been sent to your email"
                      })  
        } catch(err){
            console.log(`err sending mail\n${err}`)
        }

    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Change password for existing users
 *  @route POST /api/v1/change-password
 *  @access Public
 */
exports.changePassword = async (req, res, next) => {}