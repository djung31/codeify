const router = require('express').Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
const Jimp = require('jimp')
// const {User} = require('../db/models')
module.exports = router
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

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

    // await page.reload()
    const video = await page.$('.html5-video-player')
    await page.evaluate(() => {
      // Hide youtube player controls.
      let dom = document.querySelector('.ytp-chrome-bottom')
      dom.style.display = 'none'
    })
    // await page.keyboard.press('Space') // play
    // await page.keyboard.press('Space') // pause
    await sleep(1000)
    // instead of saving an image we'll get .. something
    let image = await video.screenshot() // binary png?
    browser.close();
    return image
  } catch (err) {
    console.error(err.response)
  }
}
const cropImage = async (image, ...vals) => {
  console.log('cropping...')
  const [x, y, w, h] = vals.map(a => +a);
  // console.log('params: ')
  // console.log(`x: ${x}`)
  // console.log(`y: ${y}`)
  // console.log(`w: ${w}`)
  // console.log(`h: ${h}`)
  let str;
  await Jimp.read(image).then(img => {
    img.crop(x, y, w, h).getBase64(Jimp.AUTO, (err, res) => {
      if (err) console.error(err.response)
      str = res
    })
  })
  return str
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
    const screenshot = await generateScreenshot(urlToScreenshot)
    const croppedImage = await cropImage(screenshot, x, y, w, h)
    // console.log(croppedImage.slice(0, 30));
    // await sleep(10000);
    let imageStr = croppedImage.slice(22);
    console.log('image generated...')

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
    next(err)
  }
  // console.log('api= ', process.env.GOOGLE_API_KEY)
  // res.sendStatus(200)
})

router.post('/', async (req, res, next) => {
  console.log('POST')
})
