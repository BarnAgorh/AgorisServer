const fs = require('fs')
const mongoose = require('mongoose')

const dotEnv = require('dotenv')
dotEnv.config({path: './config/config.env'})

const ProductsModel = require('./models/Products')

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, 'UTF-8'))

//Import data to db
const importData = async () => {
    try{
        await ProductsModel.create(products)
        console.log('data import successful')
        process.exit()
    } catch(e){
        console.log(e)
    }
}

//Flush seeded db
const deleteData = async () => {
    try{
        await ProductsModel.deleteMany()
        console.log('data deletion successful')
        process.exit()
    } catch(e){
        console.log(e)
    }
}

if(process.argv[2] === "-i"){
    importData()
} else if(process.argv[2] === "-d"){
    deleteData()
}