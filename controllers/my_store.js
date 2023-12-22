const ProductsModel = require('../models/Products')

/***
 *  @description Get all items currently loggedin user has listed
 *  @route POST /api/v1/my-store
 *  @access Private
 */
exports.getMyStoreItems = async (req, res, next) => {

    try {
        const {userId} = req.body

        const myStore = await ProductsModel.find({userId: userId})
        console.log('my store items:\n', myStore)

        return res.status(200)
                  .json({
                    success: true,
                    message: 'Store Items Retrieved Succesfully',
                    myStore
                  })

    } catch(e){
        console.log(e)
    }

}