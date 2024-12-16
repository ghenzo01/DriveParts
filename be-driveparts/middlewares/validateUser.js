const { body, validationResult } = require('express-validator')

const validateUser = [
  (req, res, next) => {
    const isCreate = req.method === 'POST'
    const isUpdate = req.method === 'PUT'

    let validators = [
      body('businessName')
        .notEmpty().withMessage('Business Name is required'),

      body('email')
        .custom((value, { req }) => {
          if (req.method === 'POST') {
            if (!value) {
              throw new Error('Email is required')
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              throw new Error('Invalid email address')
            }
          }
          return true
        }),

      body('password')
        .custom((value, { req }) => {
          if (req.method === 'POST') {
            if (!value) {
              throw new Error('Password is required')
            }
            if (value.length < 10) {
              throw new Error('Password must be at least 10 characters long')
            }
          }
          return true
        }),

      body('vatId')
        .notEmpty().withMessage('VAT ID is required'),

      body('businessType')
        .notEmpty()
        .isIn(['shop', 'workshop', 'trader', 'car dismantler'])
        .withMessage('Business Type must be one of shop, workshop, trader, car dismantler'),

      body('phone')
        .notEmpty()
        .matches(/^[0-9]+$/).withMessage('Phone must contain only digits'),

      body('whatsApp')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^[0-9]+$/).withMessage('WhatsApp must contain only digits'),

      body('website')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('Website must be a valid URL'),

      body('promotionalPhrase')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Promotional Phrase must be a string'),

      body('businessDescription')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Business Description must be a string'),

      body('logo')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Logo must be a string (URL)'),
    ]

    Promise.all(validators.map(v => v.run(req)))
      .then(() => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg)
          return res.status(400).send({
            errors: errorMessages,
          })
        }
        next()
      })
      .catch(next)
  }
]

module.exports = { validateUser }
