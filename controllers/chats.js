const UserModel = require('../models/User')
const ChatHistory = require('../models/ChatHistory')

/***
 *  @description Get chats history with all vendors
 *  @route POST /api/v1/chat-history
 *  @access Private
 */
exports.chatHistory = async (req, res, next) => {

    try {
        const {userId, vendorId} = req.body
        
        const history = await ChatHistory.find({userId: userId})
        console.log('userId in chat history:\n', history)

    } catch(e){
        console.log(e)
    }

}