const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/validate', async (req, res) => {
  const { recaptchaToken } = req.body
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is missing' })
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`

    const response = await axios.post(verificationUrl)
    const { success, score } = response.data

    if (!success || score < 0.5) {
      return res.status(400).json({ message: 'reCAPTCHA validation failed' })
    }

    res.status(200).json({ message: 'reCAPTCHA validation successful' })
  } catch (error) {
    console.error('reCAPTCHA validation error:', error)
    res.status(500).json({ message: 'Errror during reCAPTCHA validation' })
  }
})

module.exports = router
