require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const usersRoutes = require('./routes/usersRoutes')
const partsRoutes = require('./routes/partsRoutes')
const emailSender = require('./routes/eMailSender')

const genericErrorHandler = require('./middlewares/genericErrorHandler')

const PORT = process.env.PORT || 4040

const server = express()

server.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}))

server.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Db connected successfully'))
    .catch((error) => console.error('Db Connection error:', error))

server.use('/users', usersRoutes)

server.use('/parts', partsRoutes)

server.use('/email', emailSender)

server.use(genericErrorHandler)

server.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})
