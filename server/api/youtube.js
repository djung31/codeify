const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
const Jimp = require('jimp')
// const fs = require('fs')

// const {User} = require('../db/models')
module.exports = router
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const HEIGHT = 360
const WIDTH = 640
const X_SCALE = 1920 / 640
const Y_SCALE = 1080 / 360
// util

const generateScreenshot = async (url, x, y, w, h) => {
  console.log('screenshotting: ', url)
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    })
    const page = await browser.newPage()
    await page.goto(url)
    console.log('webpage: ', url)
    await page.setViewport({width: 1920, height: 1080})
    const video = await page.$('.html5-video-player')
    await page.evaluate(() => {
      // Hide youtube player controls.
      let dom = document.querySelector('.ytp-chrome-bottom')
      dom.style.display = 'none'
    })
    // instead of saving an image we'll get .. something
    const imageStr = await video
      .screenshot({
        clip: {
          x: Math.round(+x * X_SCALE),
          y: Math.round(+y * Y_SCALE),
          width: Math.round(+w * X_SCALE),
          height: Math.round(+h * Y_SCALE)
        } //must be numbers!!!!
      })
      .then(buffer => buffer.toString('base64'))
    await browser.close()
    return imageStr
  } catch (err) {
    console.error(err.response)
  }
}

router.get('/', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined || req.query.t === undefined) {
    res.send('Invalid videoId: ' + req.query.videoId + '&t=' + req.query.t)
    return
  }
  // URL PARAMS
  const videoId = req.query.videoId
  const t = req.query.t
  const x = req.query.x
  const y = req.query.y
  const w = req.query.w
  const h = req.query.h

  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=${t}s`
  try {
    // use puppeteer to generate a screenshot of the youtube vid
    const imageStr = await generateScreenshot(urlToScreenshot, x, y, w, h)
    // console.log(imageStr);
    // res.sendStatus(200);
    console.log('image generated...')
    // return
    // send the string to google cloud api
    // json req body
    const requestBody = {
      requests: [
        {
          image: {
            content: imageStr
          },
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 100
            }
          ]
        }
      ]
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
    })
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
