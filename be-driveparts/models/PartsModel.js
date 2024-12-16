const mongoose = require('mongoose')

const partsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    article: { type: String, required: true },

    year: { type: Number, required: true },
    engineType: { type: String, required: true },
    displacement: { type: String, required: true },

    fuelType: {
      type: String,
      enum: [
        'Petrol',
        'Diesel',
        'Petrol-Methane',
        'Petrol-LPG',
        'Petrol-Electric',
        'Electric',
      ],
      required: true,
    },

    transmission: {
      type: String,
      enum: [
        'Manual 4-speed',
        'Manual 5-speed',
        'Manual 6-speed',
        'Automatic',
        'Semi-Automatic',
      ],
      required: true,
    },

    bodyType: {
      type: String,
      enum: ['Sedan', 'Station Wagon', 'Cabrio-Coupè', 'Minivan', 'Multipurpose'],
      required: true,
    },

    doors: {
      type: Number,
      enum: [2, 3, 4, 5],
      required: true,
    },

    condition: {
      type: String,
      enum: ['New', 'Used', 'Reconditioned / Overhauled'],
      required: true,
    },

    price: { type: Number, required: true },
    manufacturerCode: { type: String, required: true },
    description: { type: String, required: true },

    image: { type: String, required: false },
  },
  {
    timestamps: true,
    strict: true,
  }
)

module.exports = mongoose.model('Parts', partsSchema, 'parts')
