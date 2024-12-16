const mongoose = require('mongoose')
const hashPassword = require('../middlewares/hashPassword')

const userSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, minlength: 10, required: true },
        vatId: { type: String, required: true, unique: true },
        businessType: {
            type: String,
            enum: ['shop', 'workshop', 'trader', 'car dismantler'],
            required: true,
        },
        phone: { type: String, required: true },
        whatsApp: { type: String, required: false },
        website: { type: String, required: false },
        promotionalPhrase: { type: String, required: false },
        businessDescription: { type: String, required: false },
        logo: { type: String, required: false },
        parts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'partsModel',
            },
        ],
    },
    {
        timestamps: true,
        strict: true,
    }
)

userSchema.pre('save', hashPassword)

module.exports = mongoose.model('User', userSchema, 'users')
