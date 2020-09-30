const express = require('express')

const User = require('../db/models/user')

const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
    await user.save()
    res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user)
            return res.status(404).send()
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/user/:id',async (req,res)=>{
    const _id = req.params.id
    const allowedUpdates = ['name','age','email','password']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation)
        return res.status(400).send({error:'invalid updates'})

    try{
        const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidtors:true})

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/user/:id',async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user)
            return res.status(404).send()
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router