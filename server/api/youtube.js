const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
// const fs = require('fs')

// const {User} = require('../db/models')
module.exports = router
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
router.get('/', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined || req.query.t === undefined) {
    res.send('Invalid videoId: ' + req.query.videoId + '&t=' + req.query.t)
    return
  }
  const videoId = req.query.videoId
  const t = req.query.t
  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=${t}`

  try {
    // use puppeteer to generate a screenshot of the youtube vid
    console.log('screenshotting: ', urlToScreenshot)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.goto(urlToScreenshot + '&t=' + req.query.t)
    await page.setViewport({width: 1920, height: 1080})
    const video = await page.$('.html5-video-player')
    await page.evaluate(() => {
      // Hide youtube player controls.
      let dom = document.querySelector('.ytp-chrome-bottom')
      dom.style.display = 'none'
    })

    // instead of saving an image we'll get a base64 string
    const imageStr = await video.screenshot({
      encoding: 'base64'
    })
    console.log('image generated...')

    // send the string to google cloud api
    // json req body
    const requestBody = {
      "requests":[{
         "image": {
            "content":imageStr
         },
         "features": [{
            "type": "DOCUMENT_TEXT_DETECTION",
            "maxResults": 100,
         }]
      }]
   }
    console.log('sending data to google...')
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      requestBody
    )
    console.log('google request successful!')
    // send data to client
    res.json({
      image: imageStr,
      data: response.data
    });
    await browser.close()
  } catch (err) {
    console.log(err.response)
    // next(err)
  }
  // console.log('api= ', process.env.GOOGLE_API_KEY)
  // res.sendStatus(200)
})

router.post('/', async (req, res, next) => {
  console.log('POST')
})
