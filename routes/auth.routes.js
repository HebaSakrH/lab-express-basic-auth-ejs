const express = require('express')
const User = require('../models/User.model')
const router = express.Router()
const bcryptjs = require('bcryptjs')

// const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

router.get('/signup',(req, res , next) =>{
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    try {
      const potentialUser = await User.findOne({ username: req.body.username })
      if (!potentialUser) {
          const salt = bcryptjs.genSaltSync(13)
  
          const passwordHash = bcryptjs.hashSync(req.body.password, salt)
  
          await User.create({ username: req.body.username, password: passwordHash })
          res.redirect('/auth/login')
      } else {
        res.render('auth/signup', {
          errorMessage: 'Username already in use',
          data: { username: req.body.username },
        })
      }
    } catch (error) {
      console.log(error)
    }
})
router.get('/login', (req, res, next) => {
    res.render('auth/login')
})
router.post('/login', async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      console.log(user)
      if (!!user) {
        if (bcryptjs.compareSync(req.body.password, user.password)) {
          req.session.user = { user }
          res.redirect('/profile')
          console.log('Hey Dinaa')
        } else {
          res.render('auth/login', { errorMessage: 'Wrong password' })
        }
      } else {
        res.render('auth/login', { errorMessage: 'User does not exists' })
      }
    } catch (error) {
      console.log(error)
    }
  })
  

module.exports = router