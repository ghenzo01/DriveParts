const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { cloudStorage, filter } = require('../middlewares/multer')
const { validateUser } = require('../middlewares/validateUser')
const UserModel = require('../models/UserModel')
const verifyToken = require('../middlewares/verifyToken')

const users = express.Router()

const upload = multer({ storage: cloudStorage, fileFilter: filter })


users.post('/uploadLogo', upload.single('logo'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' })
    }
    res.status(200).send({ logoPath: req.file.path })
  } catch (error) {
    next(error)
  }
})


users.post('/create', validateUser, async (req, res, next) => {
  try {

    const existingUser = await UserModel.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' })
    }

    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()

    res.status(201).send({
      message: 'User created successfully',
      savedUser,
    })
  } catch (error) {
    next(error)
  }
})


users.post('/login', async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).send({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user._id, businessName: user.businessName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).send({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email,
        logo: user.logo,
        vatId: user.vatId,
        businessType: user.businessType,
        phone: user.phone,
        whatsApp: user.whatsApp,
        website: user.website,
        promotionalPhrase: user.promotionalPhrase,
        businessDescription: user.businessDescription,
      },
    })
  } catch (error) {
    next(error)
  }
})


users.get('/logo', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).send({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findById(decoded.id)

    if (!user || !user.logo) {
      return res.status(404).send({ message: 'Logo not found' })
    }

    res.status(200).send({ logoUrl: user.logo })
  } catch (error) {
    console.error('Error fetching logo:', error)
    res.status(500).send({ message: 'Failed to retrieve logo' })
  }
})


users.post('/updateLogo', async (req, res, next) => {
  try {
    const { userId, logoPath } = req.body

    if (!userId || !logoPath) {
      return res.status(400).send({ message: 'userId and logoPath are required' })
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { logo: logoPath }, { new: true })
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' })
    }

    res.status(200).send({
      message: 'Logo updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
})


users.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) return res.status(404).send({ message: 'User not found' })
    res.status(200).send({ user })
  } catch (error) {
    next(error)
  }
})


users.put('/update', verifyToken, validateUser, async (req, res, next) => {
  try {
    delete req.body.email
    delete req.body.password

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, req.body, { new: true })
    if (!updatedUser) return res.status(404).send({ message: 'User not found' })

    res.status(200).send({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = users
