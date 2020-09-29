const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        trim: true,
        lowecase: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('age should be a positive number')
        }
    },
    password: {
        type: 'string',
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('password cannot contain "password"')
        }
    }
})

// const me = new User({
//     name: ' Sai kiran  ',
//     age: 20,
//     password: 'adafa',
//     email: 'manc@gmail.com'
// })

// me.save().then((value) => {
//     console.log(value)
// }).catch((err) => {
//     console.log(err)
// })

module.exports = User