const http = require('http')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require ('./config/database')

dotenv.config({path: 'config/config.env'})
connectDB()

const auth = require('./routes/auth')
const profile = require('./routes/profile')
const products = require('./routes/products')
const offers = require('./routes/offers')
const chats = require('./routes/chats')
const myStore = require('./routes/my_store')

const app = express()
const server = http.createServer(app)

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res, next)=>{
    res.send('Welcome to Agoris Marketplace Server')
})

app.use('/api/v1/auth', auth)
app.use('/api/v1/user', profile)
app.use('/api/v1/products', products)
app.use('/api/v1/offers', offers)
app.use('/api/v1/chats', chats)
app.use('/api/v1/my-store', myStore)

const port = process.env.PORT || 5000

server.listen(port, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
})

// handle unhandled promise rejection warnings
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ====> Unhandled Rejection  ====> ${err.message}`)

    //close the server and exit the process
    server.close(()=>{
        process.exit(1)
    })
})