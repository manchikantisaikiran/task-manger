const express = require('express')

require('./db/mongoose')

const User = require('./db/models/user')
const Task = require('./db/models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then((user) => {
        res.status(201).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then(users => {
        res.status(200).send(users)
    }).catch(err => {
        res.status(500).send()
    })
})

app.get('/user/:id', (req, res) => {
    const _id = req.params.id
    const user = User.findById(_id)

    user.then((user) => {
        if (!user)
            return res.status(404).send()
        res.status(200).send(user)
    }).catch((err) => {
        res.status(500).send()
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch(err => {
        res.status(400).send(err)
    })
})

app.get('/tasks', (req, res) => {
    const tasks = Task.find({})
    tasks.then(tasks => {
        res.send(tasks)
    }).catch(err => {
        res.status.send()
    })
})

app.get('/task/:id', (req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task)
                return res.status(404).send()
            res.send(task)
        }).catch(e => {
            res.status(500).send()
        })
})

app.listen(port, () => console.log('server is up on port ' + port))