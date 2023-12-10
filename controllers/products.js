const ProductsModel = require('../models/Products')
const UserModel = require('../models/User')
const NotificationsModel = require('../models/Offers')

/***
 *  @description Get all products listed
 *  @route POST /api/v1/products
 *  @access Private
 */
exports.getAllProducts = async (req, res, next) => {
    try{

        const {currentUserId} = req.body
        console.log('currentUserId:\t', currentUserId)

        const products = await ProductsModel.find({})
        // console.log('all products:\n', products)

        // const filteredProducts = products.filter((p) => p.vendorId !== currentlyLoggedInUserId)
        // console.log('filteredProducts:\n', filteredProducts)

        if(!products) {
            return res.status(404)
                      .json({
                        success: false,
                        message: 'No products found'
                      })  
        }

        return res.status(200)
                  .json({
                    success: true,
                    message: `All Products Retrieved Successfully`,
                    products,
                })    

    } catch(error){
        console.log(error);
    }

}

exports.getProductsInCategory = async (req, res, next) => {

    try {
        const { category } = req.body
        const categoryProducts = await ProductsModel.find({category: category})
    
        return res.status(200)
                  .json({
                    success: true,
                    message: `All Products in ${category} Category Retrieved Successfully`,
                    categoryProducts,
                })
        
    } catch(e){
        console.log(e)
    }

}

exports.makeOffer = async (req, res, next) => {
    try {
        const {userId, vendorId, productId, offerAmount} = req.body

        const foundProduct = await ProductsModel.find({_id: productId})
        if(!foundProduct){
            return res.status(404)
                      .json({
                        success: false,
                        message: 'No such product exists'
                      })
        }

        const foundUser = await UserModel.find({_id: userId})
        console.log(foundUser)

        const firstName = foundUser[0].firstName
        const lastName = foundUser[0].lastName
        const userPhoneNumber = foundUser[0].phoneNumber

        const productTitle = foundProduct[0].title
        const image = foundProduct[0].images[0]

        const offer = await NotificationsModel.create({
            firstName,
            lastName,
            userId,
            vendorId,
            productId,
            productTitle,
            image,
            offerAmount,
            userPhoneNumber
        })
        if(offer != null){
            return res.status(201)
                      .json({
                        success: true,
                        message: `You have successfully made an offer to purchase this product for ${offerAmount}`,
                        offer
                      })
        }

        // const hasMadeOfferOnProduct = NotificationsModel.find({userId, productId})
        // console.log(`hasMadeOfferOnProduct:\t${hasMadeOfferOnProduct}`)
        // if(hasMadeOfferOnProduct){
            // return res.status(400)
            //           .json({
            //             success: false,
            //             message: 'You have already made an offer on this product'
            //           })
        // } else {
            // const offer = await NotificationsModel.create({
            //     firstName,
            //     lastName,
            //     userId,
            //     vendorId,
            //     productId,
            //     productTitle,
            //     image
            // })
            // if(offer != null){
            //     return res.status(201)
            //               .json({
            //                 success: true,
            //                 message: `You have successfully made an offer to purchase this product for ${offerAmount}`,
            //                 offer
            //               })
            // }
        // }

    } catch(e){
        console.log(e)
    }
}