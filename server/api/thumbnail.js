const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
const Jimp = require('jimp')
const path = require('path')
const moment = require('moment')

module.exports = router
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

// zzz
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// url -> base64 screenshot
const generateThumbs = async (url, showToolbar) => {
  let outputArr = []
  console.log('screenshotting: ', url)
  try {
    const pathToExt = path.join(__dirname, '..', '..', 'uBlock')
    console.log(pathToExt)
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--disable-extensions-except=${pathToExt}`,
        `--load-extension=${pathToExt}`
      ],
      headless: false
      // ^ use this to debug
      // required for extensions
    })
    const page = await browser.newPage()
    await page.goto(url)
    console.log('navigating to webpage: ', url)
    await page.setViewport({width: 640, height: 360})
    const video = await page.$('.html5-video-player')
    await sleep(1000)
    await page.keyboard.press('Space')
    if (showToolbar) {
      await page.evaluate(() => {
        // Hide youtube player controls.
        let dom = document.querySelector('.ytp-chrome-bottom')
        dom.style.display = 'none'
      })
    }
    for (let i = 1; i < 10; i++) {
      await page.keyboard.press(i)
      await sleep(1000) // wait 1 sec to let video play
      let image = await video.screenshot() // binary
      console.log('screenshot taken...')
      outputArr.push(image.toString('base64'))
    }
    // browser.close()
    return outputArr
  } catch (err) {
    console.error(err.response)
  }
}

// url -> base64 screenshot
const generateThumbsTen = async (url, showToolbar, videoId) => {
  // figure out how many thumbnails we need
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${GOOGLE_API_KEY}`
  )
  let stringDuration = response.data.items[0].contentDetails.duration
  let lengthSecs = moment.duration(stringDuration, moment.ISO_8601).asSeconds()
  console.log('video length is ', lengthSecs, ' secs')

  let outputArr = []
  console.log('screenshotting: ', url)

  try {
    const pathToExt = path.join(__dirname, '..', '..', 'uBlock')
    console.log(pathToExt)
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--disable-extensions-except=${pathToExt}`,
        `--load-extension=${pathToExt}`
      ],
      headless: false
      // ^ use this to debug
      // required for extensions
    })
    const page = await browser.newPage()
    await page.goto(url)
    console.log('navigating to webpage: ', url)
    await page.setViewport({width: 640, height: 360})
    const video = await page.$('.html5-video-player')
    await sleep(1000)
    await page.keyboard.press('Space')
    if (showToolbar) {
      await page.evaluate(() => {
        // Hide youtube player controls.
        let dom = document.querySelector('.ytp-chrome-bottom')
        dom.style.display = 'none'
      })
    }
    for (let i = 0; i < lengthSecs / 10; i++) {
      await page.keyboard.press('L')
      await sleep(1000) // wait 1 sec to let video play
      let image = await video.screenshot() // binary
      console.log('screenshot taken...')
      outputArr.push(image.toString('base64'))
    }
    // browser.close()
    return outputArr
  } catch (err) {
    console.error(err.response)
  }
}

router.get('/', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined || req.query.showToolbar === undefined) {
    res.send(
      'Invalid videoId: ' +
        req.query.videoId +
        ' Invalid showtoolbar: ' +
        req.query.showToolbar
    )
    return
  }
  // VIDEO PARAMS
  const {videoId, showToolbar} = req.query
  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=0s`
  try {
    // url ->
    // use puppeteer to generate a screenshot of the youtube vid
    const screenshot = await generateThumbs(urlToScreenshot, showToolbar)
    if (screenshot === undefined) {
      console.log(`Screenshotting didn't return anything! Sending 500 status..`)
      res.sendStatus(500)
      return
    }
    res.json(screenshot)
  } catch (err) {
    console.log(err.response)
    next(err)
  }
})

router.get('/interval-ten', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined || req.query.showToolbar === undefined) {
    res.send(
      'Invalid videoId: ' +
        req.query.videoId +
        ' Invalid showtoolbar: ' +
        req.query.showToolbar
    )
    return
  }
  // VIDEO PARAMS
  const {videoId, showToolbar} = req.query
  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=0s`
  try {
    // url ->
    // use puppeteer to generate a screenshot of the youtube vid
    const screenshot = await generateThumbsTen(
      urlToScreenshot,
      showToolbar,
      videoId
    )
    if (screenshot === undefined) {
      console.log(`Screenshotting didn't return anything! Sending 500 status..`)
      res.sendStatus(500)
      return
    }
    res.json(screenshot)
  } catch (err) {
    console.log(err.response)
    next(err)
  }
})
