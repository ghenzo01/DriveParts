
const { body, validationResult } = require('express-validator')


const validateEmailBody = [

    body('to')
        .notEmpty()
        .isEmail()
        .withMessage('Recipient email address is invalid'),



    body('subject')
        .notEmpty()
        .isString()
        .isLength({ min: 5 })
        .withMessage('Subject must be at least 5 characters long'),


    body('emailText')
        .notEmpty()
        .isString()
        .isLength({ min: 10 })
        .withMessage('Email text must be at least 10 characters long'),




    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            const errorMessages = errors.array().map(error => error.msg)

            return res.status(400).send({
                errors: errorMessages
            })
        }

        next()
    }
]


module.exports = validateEmailBody
