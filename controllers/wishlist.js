const Wishlist = require('../models/Wishlist')
const Product = require('../models/Products')

/***
 *  @description Get all my products wishlisted
 *  @route POST /api/v1/wishlist
 *  @access Private
 */
exports.getMyWishlist = async (req, res, next) => {
    try{
        const {userId, productId} = req.body;
        
        let wishlist = await Wishlist.find({userId: userId})
        console.log('my wishlist items:\n', wishlist)

        if(!wishlist) {
            return res.status(404)
                      .json({
                        success: false,
                        message: `No wishlist found`
                      })  
        }

        let product =  await Product.findById({_id: productId})
        console.log('found product to be wishlisted:\n', product)

        wishlist.add(product)
        console.log('wishlist after adding product details:\n', product)

        return res.status(200)
                  .json({
            success: true,
            message: `User Wishlist Retrieved Successfully`,
            wishlist,
        })    

    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Add product to wishlist
 *  @route POST /api/v1/wishlist
 *  @access Private
 */
exports.addProductToWishlist = async (req, res, next) => {
    try{
        const {productId, userId} = req.body

        const foundProduct = await Wishlist.find({productId, userId})
        console.log('foundProduct:\n', foundProduct)

        if(foundProduct.length != 0){
            // await Wishlist.findByIdAndDelete({productId})
            return res.status(200)
                      .json({
                        success: true,
                        message: 'This product is already in your wishlist',
                        wishlist: foundProduct
                      })  
        } else {
            try{
                let product = await Wishlist.create({
                    productId,
                    userId
                })
                return res.status(201)
                      .json({
                        success: true,
                        message: 'This product has been added succesfully to your wishlist',
                        wishlist: product
                      }) 
            } catch(e){
                console.log(e)
            }
        }

    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Remove product from wishlist
 *  @route POST /api/v1/wishlist
 *  @access Private
 */
exports.removeFromMyWishlist = async (req, res, next) => {
    try{
        const {productId, userId} = req.body

        const foundProductToRemove = await Wishlist.find({_id: productId,})
        console.log('foundProductToRemove:\n', foundProductToRemove)

        console.log('foundProductToRemove.length:\t', foundProductToRemove.length)

        if(foundProductToRemove){
            await Wishlist.findByIdAndDelete({_id: productId})
            return res.status(200)
                      .json({
                        success: true,
                        message: 'This product has been removed succesfully from your wishlist',
                        foundProduct: null
                      })  
        } else {
            return res.status(400)
                      .json({
                        success: true,
                        message: 'Could not remove this product from your wishlist',
                      }) 
        }
    } catch(error){
        console.log(error);
    }
}

/***
 *  @description Remove all my products wishlisted
 *  @route POST /api/v1/wishlist
 *  @access Private
 */
exports.removeAllFromWishlist = async (req, res, next) => {
    try{
    } catch(error){
        console.log(error);
    }
}