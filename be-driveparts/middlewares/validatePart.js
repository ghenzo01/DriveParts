const { body, validationResult } = require('express-validator')

const validatePart = [
    body('brand')
        .notEmpty().withMessage('Brand is required')
        .isString().withMessage('Brand must be a string'),

    body('model')
        .notEmpty().withMessage('Model is required')
        .isString().withMessage('Model must be a string'),

    body('article')
        .notEmpty().withMessage('Article is required')
        .isString().withMessage('Article must be a string'),

    body('year')
        .notEmpty().withMessage('Year is required')
        .matches(/^\d{4}$/).withMessage('Year must be a 4-digit number')
        .custom((value) => {
            const yearNum = parseInt(value, 10)
            if (yearNum < 1970 || yearNum > 2025) {
                throw new Error('Year must be between 1970 and 2025')
            }
            return true
        }),

    body('engineType')
        .notEmpty().withMessage('Engine Type is required')
        .isString().withMessage('Engine Type must be a string'),

    body('displacement')
        .notEmpty().withMessage('Displacement is required')
        .matches(/^\d+\.\d+$/).withMessage('Displacement must have a decimal point (e.g. 1.2)'),

    body('fuelType')
        .notEmpty().withMessage('Fuel Type is required')
        .isIn(['Petrol', 'Diesel', 'Petrol-Methane', 'Petrol-LPG', 'Petrol-Electric', 'Electric'])
        .withMessage('Invalid Fuel Type'),

    body('transmission')
        .notEmpty().withMessage('Transmission is required')
        .isIn(['Manual 4-speed', 'Manual 5-speed', 'Manual 6-speed', 'Automatic', 'Semi-Automatic'])
        .withMessage('Invalid Transmission'),

    body('bodyType')
        .notEmpty().withMessage('Body Type is required')
        .isIn(['Sedan', 'Station Wagon', 'Cabrio-Coupè', 'Minivan', 'Multipurpose'])
        .withMessage('Invalid Body Type'),

    body('doors')
        .notEmpty().withMessage('Doors are required')
        .isInt().withMessage('Doors must be a number')
        .custom((value) => {
            const allowed = [2, 3, 4, 5]
            if (!allowed.includes(parseInt(value, 10))) {
                throw new Error('Invalid Doors')
            }
            return true
        }),

    body('condition')
        .notEmpty().withMessage('Condition is required')
        .isIn(['New', 'Used', 'Reconditioned / Overhauled'])
        .withMessage('Invalid Condition'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),

    body('manufacturerCode')
        .notEmpty().withMessage('Manufacturer Code is required')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Manufacturer Code must be alphanumeric'),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),

    body('image')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Image must be a string (URL or base64)'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(400).send({ errors: errorMessages })
        }
        next()
    },
]

module.exports = { validatePart }
