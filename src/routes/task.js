const express = require('express')
const Task = require('../db/models/task')
const auth = require('.././middleware/auth')
const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        author: req.user._id,
        ...req.body
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({author:req.user._id})
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation)
        res.status(400).send({ error: 'invalid updates' })

    try {
        const task = await Task.findOne({ _id, author: req.user._id })

        if (!task)
            res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id, author: req.user._id })
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

const main = async () => {
    const task = await Task.findById('5f7fce15cc4591024c9e51fe')
    await task.populate('author').execPopulate()
    console.log(task.author)
}

// main()



module.exports = router