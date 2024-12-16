const express = require('express')
const sgMail = require('@sendgrid/mail')
const validateEmailBody = require('../middlewares/validateEmailBody')

const emailSender = express.Router()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

emailSender.post('/sendEmail', validateEmailBody, async (req, res) => {
    const { to, subject, emailText, userEmail, isRequestForm } = req.body

    const msgToSeller = {
        to: to,
        from: process.env.SENDGRID_SENDER,
        subject,
        text: emailText,
    }

    try {
        await sgMail.send(msgToSeller)

        if (userEmail) {
            let confirmationText
            if (isRequestForm) {
                confirmationText = `Hello,

This is a confirmation that your request has been forwarded to all registered sellers on Drive Parts. They will contact you if they have what you need.

Thank you for using Drive Parts!`
            } else {
                confirmationText = `Hello,

This is a confirmation that your inquiry about the part on Drive Parts has been successfully sent to the seller. Please wait for their response.

Thank you for using Drive Parts!`
            }

            const msgToUser = {
                to: userEmail,
                from: process.env.SENDGRID_SENDER,
                subject: 'Your inquiry has been sent - Drive Parts',
                text: confirmationText
            }

            await sgMail.send(msgToUser)
        }

        res.status(200).send({
            statusCode: 200,
            message: 'Your mail has been sent and a confirmation has been sent to you!'
        })

    } catch (error) {
        console.error('Error during sending mail: ', error)
        res.status(500).send({
            statusCode: 500,
            message: 'Error during sending mail',
            errorDetails: error.response ? error.response.body : 'Unknown error'
        })
    }
})

module.exports = emailSender
