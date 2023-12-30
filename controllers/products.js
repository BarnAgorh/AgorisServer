const ProductsModel = require('../models/Products')
const UserModel = require('../models/User')
const NotificationsModel = require('../models/Offers')
const ChatHistory = require('../models/ChatHistory')

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

/***
 *  @description Get details of a product listed
 *  @route POST /api/v1/product-details
 *  @access Private
 */
exports.getSingleProduct = async (req, res, next) => {
    try{

        const {productId} = req.body
        console.log('productId:\t', productId)

        const product = await ProductsModel.find({_id: productId})
        console.log('product details:\n', product)

        if(!product) {
            return res.status(404)
                      .json({
                        success: false,
                        message: 'No product found'
                      })  
        }

        return res.status(200)
                  .json({
                    success: true,
                    message: `Product Retrieved Successfully`,
                    product: product[0],
                })    

    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Get categories of all products listed
 *  @route POST /api/v1/products-category
 *  @access Private
 */
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

/***
 *  @description Make a price offer on a product listed
 *  @route POST /api/v1/make-offer
 *  @access Private
 */
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

    } catch(e){
        console.log(e)
    }
}

exports.getMyProducts = async (req, res, next) => {
    try {
        const {vendorId} = req.body
    
        const products = await ProductsModel.find({vendorId})
        console.log('my products items:\n', products)
    
        return res.status(200)
                  .json({
                    success: true,
                    message: 'My Product Items Retrieved Succesfully',
                    products
                  })
    
    } catch(e){
        console.log(e)
    }
}

/***
 *  @description Create a chat history with the vendor of the product listed
 *  @route POST /api/v1/chat-seller
 *  @access Private
 */
exports.chatSeller = async (req, res, next) => {

    try {
        const {userId, vendorId} = req.body
        
        const createHistory = await ChatHistory.create({
            userId,
            vendorId
        })

        if(createHistory != null){
            return res.status(201)
                      .json({
                        success: true,
                        message: 'Success',
                      })
        }

    } catch(e){
        console.log(e)
    }

}