const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require ('./config/database')

dotenv.config({path: 'config/config.env'})
connectDB()

const auth = require('./routes/auth')
const profile = require('./routes/profile')

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res, next)=>{
    res.send('Welcome to Agoris Marketplace Server')
})

app.use('/api/v1/auth', auth)
app.use('/api/v1/profile', profile)

const port = process.env.PORT || 5000

const server = app.listen(port, ()=>{
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