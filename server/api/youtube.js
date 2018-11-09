const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios');
// const {User} = require('../db/models')
module.exports = router

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
    console.log('image generated...');

    // send the string to google cloud api





    res.send(imageStr)

    await browser.close()
  } catch (err) {
    console.log(err)
    next(err);
  }
  // console.log('api= ', process.env.GOOGLE_API_KEY)
  // res.sendStatus(200)
})

router.post('/', async (req, res, next) => {
  console.log('POST')
})
