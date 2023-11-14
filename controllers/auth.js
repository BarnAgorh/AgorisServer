
const UserModel = require('../models/User')

const {registerSchema, loginSchema} = require('../utils/validation_schema')

const OTPVerification = require("../models/OTPVerification")
const PasswordChangeModel = require("../models/PasswordChangeModel")
const bcrypt = require("bcryptjs")
const sendEmail = require('../utils/email')

/***
 *  @description Create a new user 
 *  @route POST /api/v1/register
 *  @access Public
 */
exports.registerUser = async (req, res, next) => {
    try{

        const {firstName, lastName, email, password,} = req.body

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
            verifiedEmail: false
        })

        const token = user.getSignedJwtToken()

        if(user != null){

            try{

                const user = await UserModel.findOne({email:req.body.email})
                if(!user) {
                    return res.status(409)
                              .json({
                                success: false,
                                message: `The email ${email} is not registered with Agoris`
                              })  
                }
            
                const otp = `${Math.floor(100000 + Math.random() * 90000)}`
                console.log('otp\t', otp)

                const message = `
                    Hello ${user.firstName}, \n\n 
                    Welcome to Agoris\n\n Please use this secure code\t${otp}\t to verify your email inside the Agoris app. \n\n 
                    This code will expire in 1 hour. \n\n\n 
                    From,\nThe Agoris Team
                `
        
                try{
                    const saltRounds = 10
                    const hashedOtp = await bcrypt.hash(otp, saltRounds)

                    OTPVerification.create({
                        userId: user.id,
                        otp: hashedOtp,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    })

                    await sendEmail({
                        email: req.body.email,
                        subject: "Verify Your Email Address",
                        message
                    })

                    return res.status(201)
                      .json({
                        success: true,
                        message: `Registration successful. A secure code has been sent to ${email} for verification`,
                        user,
                        token
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

        const { userId, otp, email } = req.body

        const user = await UserModel.findOne({email})
        if(!user) {
            return res.status(404)
                      .json({
                        success: false,
                        message: `The email ${email} is not registered with Agoris`
                      })  
        }

        try{

            if(!userId || !otp){
                return res.status(400)
                      .json({
                        success: false,
                        message: 'Please enter the OTP sent to your email'
                      })  
            } else {

                const record = await OTPVerification.find({userId})
                console.log('record\n', record)
                
                const recordId = record[0]._id
                console.log('record id\n', record[0]._id)

                if(record.length <= 0) {
                    return res.json(404)
                            .status({
                                success: false,
                                message: "Invalid account or this OTP has already been used. Please sign up again or login"
                            })  
                } else {
                    const {expiresAt} = record
                    const hashedOtp = record[0].otp

                    if(expiresAt < Date.now()){
                        // await record.findByIdAndRemove({recordId})
                        // await record.remove({})
                        return res.json(404)
                            .status({
                                success: false,
                                message: "This secure sode has expired. Please try another one"
                            })  
                    } else {
                        const isValid = bcrypt.compare(otp, hashedOtp)
                        if(!isValid){
                            return res.json(400)
                            .status({
                                success: false,
                                message: "Incorrect OTP"
                            })  
                        } else {
                            await UserModel.updateOne({_id: userId}, {verifiedEmail: true})
                            // await record.remove({})
                            // await record.findByIdAndRemove({recordId})
                            // await record.delete({userId})
                    
                            const message = `Hello ${user.firstName}, Your email has been verified. Happy Shopping on Agoris\n\n \n\n\n From,\nThe Agoris Team`
                            await sendEmail({
                                email: req.body.email,
                                subject: "Welcome to Agoris",
                                message,
                                amp: ``
                            })
                            return res.status(200)
                                    .json({
                                        success: true,
                                        message: "Email Verification Successful"
                                    }) 
                        }
                    }
                }
            }

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

        try{

            const otp = `${Math.floor(100000 + Math.random() * 90000)}`
            console.log('otp\t', otp)
                    
            const saltRounds = 10
            const hashedOtp = await bcrypt.hash(otp, saltRounds)

            const message = `
                Hello ${user.firstName}, \n\n 
                You are seeing this message because a forgot password request was initiated on your account. 
                \n Use this secure code\t\n ${otp}\t\nto proceed to resetting your password inside the Agoris app. 
                \n\n This code will expire in 10 minutes. 
                \n\n\n 
                From,\nThe Agoris Team
            `

            PasswordChangeModel.create({
                userId: user.id,
                otp: hashedOtp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000
            })

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
exports.changePassword = async (req, res, next) => {

    try{

        if(!userId || !otp || !password){
            return res.status(400)
                      .json({
                        success: false,
                        message: `Please fill in all the fields`
                      }) 
        }

        const { userId, otp, password } = req.body
        const email = ''

        const user = await UserModel.findById(userId)
        console.log(user)
        if(!user) {
            return res.status(404)
                      .json({
                        success: false,
                        message: `No such user account found registered with Agoris`
                      })  
        }

        try{

            if(!userId || !otp){
                return res.status(400)
                      .json({
                        success: false,
                        message: 'Please enter the OTP sent to your email'
                      })  
            } else {

                const record = await PasswordChangeModel.find({userId})
                console.log('record\n', record)
                
                const recordId = record[0]._id
                console.log('record id\n', record[0]._id)

                if(record.length <= 0) {
                    return res.json(404)
                            .status({
                                success: false,
                                message: "Invalid account or this OTP has already been used. Please sign up again or login"
                            })  
                } else {
                    const {expiresAt} = record
                    const hashedOtp = record[0].otp

                    if(expiresAt < Date.now()){
                        // await record.findByIdAndRemove({recordId})
                        // await record.remove({})
                        return res.json(404)
                            .status({
                                success: false,
                                message: "This secure sode has expired. Please try another one"
                            })  
                    } else {
                        const isValid = bcrypt.compare(otp, hashedOtp)
                        if(!isValid){
                            return res.json(400)
                            .status({
                                success: false,
                                message: "Incorrect OTP"
                            })  
                        } else {
                            
                            let salt = await bcrypt.genSalt(10)
                            const hashedPassword = await bcrypt.hash(password, salt)

                            await UserModel.updateOne({_id: userId}, {password: hashedPassword})
                            // await record.remove({})
                            // await record.findByIdAndRemove({recordId})
                            // await record.delete({userId})
                    
                            const message = `Hello ${user.firstName}, Your password has been changed successfully. 
                                Happy Shopping on Agoris\n\n \n\n\n From,\nThe Agoris Team`
                            await sendEmail({
                                email: user.email,
                                subject: "Agoris - Password Changed",
                                message,
                                amp: ``
                            })
                            return res.status(200)
                                    .json({
                                        success: true,
                                        message: "Password Changed Successfully"
                                    }) 
                        }
                    }
                }
            }

        } catch(err){
            console.log(`err sending mail\n${err}`)
        }

    } catch(error){
        console.log(error);
    }

}