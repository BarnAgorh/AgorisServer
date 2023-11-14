
// const ProfileModel = require('../models/Profile')

// /***
//  *  @description Get user profile
//  *  @route GET /api/v1/profile
//  *  @access Private
//  */
// exports.getMyProfile = async (req, res, next) => {
//     try{
//         const { userId } = req.body
//         console.log('userId\t', userId)

//         const user = await UserModel.findById(userId)
//         console.log(user)

//         if(!user) {
//             return res.status(404)
//                       .json({
//                         success: false,
//                         message: 'No user found'
//                       })  
//         }

//         return res.status(200)
//                       .json({
//                         success: true,
//                         message: `User Profile Retrived Successfully`,
//                         user,
//                       })    

//     } catch(error){
//         console.log(error);
//     }

// }

// /***
//  *  @description Update user profile
//  *  @route PUT /api/v1/update-profile
//  *  @access Private
//  */
// exports.updateMyProfile = async (req, res, next) => {

//     try{

//         const { userId, otp, password } = req.body
//         const email = ''

//         const user = await UserModel.findById(userId)
//         console.log(user)
//         if(!user) {
//             return res.status(404)
//                       .json({
//                         success: false,
//                         message: `No such user account found registered with Agoris`
//                       })  
//         }

//         try{

//             if(!userId || !otp){
//                 return res.status(400)
//                       .json({
//                         success: false,
//                         message: 'Please enter the OTP sent to your email'
//                       })  
//             } else {

//                 const record = await PasswordChangeModel.find({userId})
//                 console.log('record\n', record)
                
//                 const recordId = record[0]._id
//                 console.log('record id\n', record[0]._id)

//                 if(record.length <= 0) {
//                     return res.json(404)
//                             .status({
//                                 success: false,
//                                 message: "Invalid account or this OTP has already been used. Please sign up again or login"
//                             })  
//                 } else {
//                     const {expiresAt} = record
//                     const hashedOtp = record[0].otp

//                     if(expiresAt < Date.now()){
//                         // await record.findByIdAndRemove({recordId})
//                         // await record.remove({})
//                         return res.json(404)
//                             .status({
//                                 success: false,
//                                 message: "This secure sode has expired. Please try another one"
//                             })  
//                     } else {
//                         const isValid = bcrypt.compare(otp, hashedOtp)
//                         if(!isValid){
//                             return res.json(400)
//                             .status({
//                                 success: false,
//                                 message: "Incorrect OTP"
//                             })  
//                         } else {
                            
//                             let salt = await bcrypt.genSalt(10)
//                             const hashedPassword = await bcrypt.hash(password, salt)

//                             await UserModel.updateOne({_id: userId}, {password: hashedPassword})
//                             // await record.remove({})
//                             // await record.findByIdAndRemove({recordId})
//                             // await record.delete({userId})
                    
//                             const message = `Hello ${user.firstName}, Your password has been changed successfully. 
//                                 Happy Shopping on Agoris\n\n \n\n\n From,\nThe Agoris Team`
//                             await sendEmail({
//                                 email: user.email,
//                                 subject: "Agoris - Password Changed",
//                                 message,
//                                 amp: ``
//                             })
//                             return res.status(200)
//                                     .json({
//                                         success: true,
//                                         message: "Password Changed Successfully"
//                                     }) 
//                         }
//                     }
//                 }
//             }

//         } catch(err){
//             console.log(`err sending mail\n${err}`)
//         }

//     } catch(error){
//         console.log(error);
//     }

// }