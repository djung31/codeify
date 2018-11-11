const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
const Jimp = require('jimp')
module.exports = router
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
// zzz
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// url -> base64 screenshot
const generateThumbs = async url => {
  let outputArr = []
  console.log('screenshotting: ', url)
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--load-extension=./../uBlock']
      , headless: false
      // ^ use this to debug
    })
    const page = await browser.newPage()
    await page.goto(url)
    console.log('navigating to webpage: ', url)
    await page.setViewport({width: 640, height: 360})
    const video = await page.$('.html5-video-player')
    // await page.evaluate(() => {
    //   // Hide youtube player controls.
    //   let dom = document.querySelector('.ytp-chrome-bottom')
    //   dom.style.display = 'none'
    // })
    await sleep(1000)
    await page.keyboard.press('Space')
    for (let i = 0; i < 10; i++) {
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

router.get('/', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined) {
    res.send('Invalid videoId: ' + req.query.videoId)
    return
  }
  // VIDEO PARAMS
  const {videoId} = req.query
  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=0s`
  // get video length

  // loop over video and generate screenshots

  // send screenshot as streamed data

  // end response

  try {
    // url ->
    // use puppeteer to generate a screenshot of the youtube vid
    const screenshot = await generateThumbs(urlToScreenshot)
    if (screenshot === undefined) {
      console.log(`Crop didn't return anything! Sending 500 status..`)
      res.sendStatus(500)
      return
    }
    res.json(screenshot);
    // remove base64 prefix metadata
  } catch (err) {
    console.log(err.response)
    next(err)
  }
})
