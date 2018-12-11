# Codeify

Tired of manually typing out text from a YouTube video? Codeify can do it for you.

## Demo
Visit http://codeify-yt.herokuapp.com/ and follow the instructions.

## About the app

The frontend was built in React and Redux. The backend was built in Node/Express.

Other technologies used include:
- Puppeteer: https://github.com/GoogleChrome/puppeteer
- Google Cloud Vision API: https://cloud.google.com/vision/docs/ocr
- CodeMirror: https://codemirror.net/index.html

## How it works:
The client loads the video into the browser. The user can pause the video, and draw a cropping rectangle. The client then sends a video ID, timestamp, and crop parameters to the server. 

Puppeteer loads the video, navigates to the timestamp, screenshots the image, crops it, then sends it to the Google Cloud Vision API, which returns text.

The server returns the screenshot and the text into the clipboard area. The user can clean up the text in the CodeMirror code editor before copying it over to their IDE of choice.
