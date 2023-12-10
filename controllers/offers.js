const NotificationsModel = require('../models/Offers')

/***
 *  @description Get all products listed
 *  @route POST /api/v1/offers
 *  @access Private
 */
exports.getMyOffers = async (req, res, next) => {
    try{

        const {vendorId} = req.body
        console.log('currentUserId:\t', vendorId)

        const offers = await OffersModel.find({vendorId})
        console.log('my notifications:\n', notifications)

        if(!offers) {
            return res.status(404)
                      .json({
                        success: false,
                        message: 'No offers found'
                      })  
        }

        return res.status(200)
                  .json({
                    success: true,
                    message: `Your offers have been Retrieved Successfully`,
                    offers,
                })    

    } catch(error){
        console.log(error);
    }

}