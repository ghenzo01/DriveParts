const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { v2: cloudinary } = require("cloudinary")
const multer = require("multer")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const allowedFormats = ['jpg', 'jpeg', 'png', 'webp']

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'BOOKS_IMG_UPLOADS',
        allowed_formats: allowedFormats,

        public_id: (req, file) => file.originalname.split('.')[0]
    }
})

const filter = (req, file, cb) => {

    const mimeAllowed = ['image/png', 'image/jpeg', 'image/webp']
    const extAllowed = allowedFormats

    const extension = file.originalname.toLowerCase().split('.').pop()

    if (mimeAllowed.includes(file.mimetype) && extAllowed.includes(extension)) {
        cb(null, true)
    } else {
        cb(new Error('Only PNG, JPG, JPEG and WEBP files are allowed!'), false)
    }
}

module.exports = {
    cloudStorage,
    filter
}
