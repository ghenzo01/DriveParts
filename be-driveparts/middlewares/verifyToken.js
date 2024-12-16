

const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {

    const token = req.header('authorization')

    if (!token) {
        return res
            .status(403)
            .send({
                statusCode: 403,
                message: "Token not valid or not passed"
            })
    }

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified

        next()
    } catch (e) {

        res
            .status(403)
            .send({
                statusCode: 403,
                message: 'Token expired or not valid'
            })
    }
}