const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  console.log('api= ', process.env.GOOGLE_API_KEY);
  res.sendStatus(200);
})

router.post('/', async (req, res, next) => {
  console.log('POST')
})
