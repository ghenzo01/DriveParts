

const bcrypt = require('bcrypt')


const hashPassword = async function (next) {

    const user = this

    if (!user.isModified('password'))
        return next()


    try {

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        next()
    }

    catch (error) {
        next(error)
    }
}

module.exports = hashPassword