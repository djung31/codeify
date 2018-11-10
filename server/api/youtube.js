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
const generateScreenshot = async url => {
  console.log('screenshotting: ', url)
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
      // ^ use this to debug
    })
    const page = await browser.newPage()
    await page.goto(url)
    console.log('navigating to webpage: ', url)

    // viewport doesn't seem to actually work
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    await page.setViewport({width: 1920, height: 1080})
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

    const video = await page.$('.html5-video-player')
    await page.evaluate(() => {
      // Hide youtube player controls.
      let dom = document.querySelector('.ytp-chrome-bottom')
      dom.style.display = 'none'
    })

    // await page.keyboard.press('Space')
    await sleep(1000) // wait 1 sec to let video play
    let image = await video.screenshot() // binary
    console.log('screenshot taken...')
    browser.close()
    return image.toString('base64') // convert to base64 ?
    // return image // return binary for now
  } catch (err) {
    console.error(err.response)
  }
}

const printImageSize = async image => {
  let w, h
  try {
    await Jimp.read(Buffer.from(image, 'base64')).then(img => {
      w = img.bitmap.width
      h = img.bitmap.height
    })
    return `width ${w} x height ${h}`
  } catch (err) {
    console.log('reading image size failed')
    console.error(err.response)
  }
}

// (uncroppedImage, x, y, w, h) -> croppedImage
const cropImage = async (image, ...vals) => {
  const [x, y, w, h] = vals.map(a => +a) // convert strings to numbers (in case)
  try {
    console.log('cropping...')
    console.log('input image size: ', await printImageSize(image))
    console.log(`result should be ${w} x ${h}`)
  } catch (err) {
    console.error(err.response)
  }

  try {
    const buffer = Buffer.from(image, 'base64') // base64 -> binary
    let img = await Jimp.read(buffer) // binary -> jimp
    await img.crop(x, y, w, h)
    let output = await img.getBase64Async(Jimp.AUTO) // jimp -> base64
    console.log('cropped successfully')
    return output
  } catch (err) {
    console.log('crop failed :(')
    console.error(err)
  }
}

router.get('/', async (req, res, next) => {
  // check query params for validity
  if (req.query.videoId === undefined || req.query.t === undefined) {
    res.send('Invalid videoId: ' + req.query.videoId + '&t=' + req.query.t)
    return
  }
  // VIDEO PARAMS
  const {videoId, t, x, y, w, h} = req.query

  const urlToScreenshot = `https://www.youtube.com/watch?v=${videoId}&t=${t}s`
  try {
    // use puppeteer to generate a screenshot of the youtube vid
    const screenshot = await generateScreenshot(urlToScreenshot)
    const croppedImage = await cropImage(screenshot, +x, +y, +w, +h)
    if (croppedImage === undefined) {
      console.log(`Crop didn't return anything! Sending 500 status..`)
      res.sendStatus(500)
      return
    }

    console.log('cropped image dims: ', await printImageSize(croppedImage))
    // remove base64 prefix metadata
    let imageStr = croppedImage.slice(croppedImage.indexOf('base64') + 7)

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
    // console.log('sending data to google...')
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
