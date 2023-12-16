const Wishlist = require('../models/Wishlist')
const Product = require('../models/Products')

/***
 *  @description Get all my products wishlisted
 *  @route POST /api/v1/wishlist
 *  @access Private
 */
exports.getMyWishlist = async (req, res, next) => {
    try{
        const {userId} = req.body;

        let wishlist = []
        let items = await Wishlist.find({userId: userId})

        if(!items) {
            return res.status(404)
                      .json({
                        success: false,
                        message: `No wishlist found`
                      })  
        }

        for(let i = 0; i < items.length; i++){
            let product =  await Product.findById({_id: items[i].productId})
            wishlist.push(product)
        }

        return res.status(200)
                  .json({
                    success: true,
                    message: `User Wishlist Retrieved Successfully`,
                    wishlist
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

        const foundProductToRemove = await Wishlist.find({_id: productId, userId: userId})
        console.log('foundProductToRemove:\n', foundProductToRemove)

        if(foundProductToRemove){
            await Wishlist.findByIdAndDelete({_id: productId})
            return res.status(200)
                      .json({
                        success: true,
                        message: 'This product has been removed succesfully from your wishlist',
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
//  *  @description Remove all my products wishlisted
//  *  @route POST /api/v1/wishlist
//  *  @access Private
//  */
// exports.removeAllFromWishlist = async (req, res, next) => {
//     try{

//         const {userId} = req.body

//         let wishlist = await Wishlist.findById({userId: userId})
//         console.log('found user wishlist:\n', wishlist)

//         if(wishlist.length > 0){
//             let response = await Wishlist.deleteMany({userId: userId})
//             console.log(response)

//             return res.status(200)
//                   .json({
//                     success: true,
//                     message: 'Your wishlisted items have been successfully deleted',
//                     wishlist: []
//                   }) 
//         } 

//         return res.status(200)
//                   .json({
//                     success: true,
//                     message: 'Your wishlist is already empty',
//                     wishlist: []
//                   }) 

//     } catch(error){
//         console.log(error);
//     }
// }