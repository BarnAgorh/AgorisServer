const User = require('../models/User')

/***
 *  @description Get user profile
 *  @route GET /api/v1/profile
 *  @access Private
 */
exports.getMyProfile = async (req, res, next) => {
    try{
        const { userId } = req.body

        const user = await User.findById(userId)
        console.log(user)

        if(!user) {
            return res.status(404)
                      .json({
                        success: false,
                        message: 'No user found'
                      })  
        }

        return res.status(200)
                  .json({
            success: true,
            message: `User Profile Retrieved Successfully`,
            user,
        })    

    } catch(error){
        console.log(error);
    }

}

/***
 *  @description Update user profile
 *  @route PUT /api/v1/update-profile
 *  @access Private
 */
exports.updateMyProfile = async (req, res, next) => {

    try{

        const {userId, firstName, lastName, state, city, phoneNumber} = req.body

        const fieldsToUpdate = {firstName, lastName, state, city, phoneNumber}

        try{
            const user = await User.findById(userId)
            if(!user){
                return res.status(404)
                          .json({
                            success: false,
                            message: "No such user exists"
                          })   
            }
            console.log('found user profile to update:\n', user)

            const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
                new: true,
                runValidators: true,
            })
            if(updatedUser){
                return res.status(200)
                          .json({
                            success: true,
                            message: "Your profile has been updated",
                            user: updatedUser
                          })
            }
        } catch(err){
            console.log(err)
        }

    } catch(error){
        console.log(error);
    }

}

exports.setFCMPushTokenOnUser = async (req, res, next) => {

    try{

        const {userId, fcmToken} = req.body

        const fieldsToUpdate = {fcmToken}

        try{
            const user = await User.findById(userId)
            
            if(!user){
                return res.status(404)
                          .json({
                            success: false,
                            message: "No such user exists"
                          })   
            }
            console.log('found user profile to update:\n', user)

            const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
                new: true,
                runValidators: true,
            })
            if(updatedUser){
                return res.status(200)
                          .json({
                            success: true,
                            message: "Your FCM Push Token has Been Saved Successfully",
                            user: updatedUser
                          })
            }
        } catch(err){
            console.log(err)
        }

    } catch(error){
        console.log(error);
    }

}