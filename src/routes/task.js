const express = require('express')
const Task = require('../db/models/task')
const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)    
    }catch(e){
        res.status(400).send()
    }
})

router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/task/:id', async (req, res) => {
    try{
       const task = await Task.findById(req.params.id)
       if(!task)
            return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/task/:id',async (req,res)=>{
    const _id = req.params.id
    const allowedUpdates = ['description','completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    
    if(!isValidOperation)
        res.status(400).send({error:'invalid updates'})

    try{
        const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidtors:true})

        if(!task)
            res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/task/:id',async (req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task)
            return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})


module.exports = router