const express = require('express')
const multer = require('multer')
const { cloudStorage, filter } = require('../middlewares/multer')
const { validatePart } = require('../middlewares/validatePart')
const verifyToken = require('../middlewares/verifyToken')
const PartsModel = require('../models/PartsModel')
const UserModel = require('../models/UserModel')

const parts = express.Router()
const upload = multer({ storage: cloudStorage, fileFilter: filter })


parts.post('/create', verifyToken, validatePart, async (req, res, next) => {
  try {
    const userId = req.user.id

    const newPart = new PartsModel({
      user: userId,
      brand: req.body.brand,
      model: req.body.model,
      article: req.body.article,
      year: req.body.year,
      engineType: req.body.engineType,
      displacement: req.body.displacement,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      bodyType: req.body.bodyType,
      doors: req.body.doors,
      condition: req.body.condition,
      price: req.body.price,
      manufacturerCode: req.body.manufacturerCode,
      description: req.body.description,
      image: req.body.image || null,
    })

    const savedPart = await newPart.save()

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { parts: savedPart._id } },
      { new: true }
    )

    res.status(201).send({
      message: 'Part created successfully',
      part: savedPart,
    })
  } catch (error) {
    next(error)
  }
})


parts.post('/uploadImage/:id', verifyToken, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' })
    }

    const partId = req.params.id
    const userId = req.user.id

    const part = await PartsModel.findOne({ _id: partId, user: userId })
    if (!part) {
      return res.status(404).send({ message: 'Part not found or not yours' })
    }

    part.image = req.file.path
    const updatedPart = await part.save()

    res.status(200).send({
      message: 'Image uploaded and part updated successfully',
      part: updatedPart,
    })
  } catch (error) {
    next(error)
  }
})


parts.get('/all', async (req, res, next) => {
  try {
    const { brand = '', model = '', article = '', page = 1, limit = 5 } = req.query
    const query = {}

    if (brand) query.brand = brand
    if (model) query.model = model
    if (article) query.article = article

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [partsData, totalCount] = await Promise.all([
      PartsModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'businessName logo'),
      PartsModel.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalCount / limit)

    res.send({
      parts: partsData,
      currentPage: parseInt(page),
      totalPages
    })
  } catch (error) {
    next(error)
  }
})


parts.get('/user', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { brand = '', model = '', article = '', page = 1, limit = 5 } = req.query
    const query = { user: userId }

    if (brand) query.brand = brand
    if (model) query.model = model
    if (article) query.article = article

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [partsData, totalCount] = await Promise.all([
      PartsModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'businessName logo'),
      PartsModel.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalCount / limit)

    res.status(200).send({
      parts: partsData,
      currentPage: parseInt(page),
      totalPages
    })
  } catch (error) {
    next(error)
  }
})


parts.get('/details/:id', async (req, res, next) => {
  try {
    const partId = req.params.id
    const part = await PartsModel.findById(partId).populate('user')
    if (!part) {
      return res.status(404).send({ message: 'Part not found' })
    }
    res.status(200).send({ part })
  } catch (error) {
    next(error)
  }
})


parts.put('/update/:id', verifyToken, validatePart, async (req, res, next) => {
  try {
    const userId = req.user.id
    const partId = req.params.id

    const part = await PartsModel.findOne({ _id: partId, user: userId })
    if (!part) {
      return res.status(404).send({ message: 'Part not found or not yours' })
    }

    part.brand = req.body.brand
    part.model = req.body.model
    part.article = req.body.article
    part.year = req.body.year
    part.engineType = req.body.engineType
    part.displacement = req.body.displacement
    part.fuelType = req.body.fuelType
    part.transmission = req.body.transmission
    part.bodyType = req.body.bodyType
    part.doors = req.body.doors
    part.condition = req.body.condition
    part.price = req.body.price
    part.manufacturerCode = req.body.manufacturerCode
    part.description = req.body.description

    const updatedPart = await part.save()
    res.status(200).send({ message: 'Part updated successfully', part: updatedPart })
  } catch (error) {
    next(error)
  }
})


parts.delete('/delete/:id', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id
    const partId = req.params.id

    const part = await PartsModel.findOne({ _id: partId, user: userId })
    if (!part) {
      return res.status(404).send({ message: 'Part not found or not yours' })
    }

    await part.deleteOne()

    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { parts: partId } },
      { new: true }
    )

    res.status(200).send({ message: 'Part deleted successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = parts
