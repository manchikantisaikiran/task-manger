const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task