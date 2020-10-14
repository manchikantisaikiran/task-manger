const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../db/models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail,sendOffEmail } = require('../emails/accounts')
const router = express.Router()

const upload = multer({
    // dest: 'src/avatar',
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(RegExp('\.(JPG|png|jpeg)$'))) {
            return cb(new Error('file must be a image'))
        }

        cb(undefined, true)
        // cb(new Error('file must be a image'))
        // cb(undefined,true)
        // cb(undefined,false)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenobj => req.token !== tokenobj.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/user/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send({ error: 'invalid updates' })

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendOffEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar)
            throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

const main = async () => {
    const user = await User.findById('5f7dfa92cde8911dbcd8241b')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

// main()

module.exports = router