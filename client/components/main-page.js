import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  clearOcrState,
  resetYoutube,
  setCurrentTime,
  generateOcrData
} from '../store'
import YouTube from 'react-youtube'
import {Rector} from './index'

class MainPage extends Component {
  constructor() {
    super()
    this.canvasRef = React.createRef()
    this.state = {
      isCropping: false,
      currentPlayerState: NaN,
      // rectangle for canvas
      selected: false,
      x: -1,
      y: -1,
      w: -1,
      h: -1
    }
  }
  componentWillUnmount() {
    this.props.resetYoutube()
    this.props.clearOcrState()
  }

  onGenerateBtnClick = () => {
    const {videoId, currentTime} = this.props
    const {x, y, w, h} = this.state;
    const cropArray = [x,y,w,h]
    this.props.generateOcrData(videoId, currentTime, cropArray)
  }

  // controls drawing rectangle
  toggleCrop = () => {
    const curVal = this.state.isCropping
    this.setState({isCropping: !curVal})
  }

  onSelected = rect => {
    this.setState({selected: true, ...rect})
  }

  getSelectionStr() {
    if (this.state.selected) {
      const state = this.state
      return `x: ${state.x}, y: ${state.y}, w: ${state.w}, h: ${state.h}`
    }
    return 'No Selection'
  }

  render() {
    const HEIGHT = 360
    const WIDTH = 640
    const {videoId, ocrData, currentTime} = this.props
    const {ocrText, image, visionData} = ocrData
    const opts = {
      height: HEIGHT,
      width: WIDTH,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    }
    const isPaused = (this.state.currentPlayerState === 2) // true if video paused
    const isCropping = this.state.isCropping
    // overlay video and canvas elememnts

    return (
      <div className="columns">
        <div className="column">
          <div className="youtube-container">
            <YouTube
              videoId={`${videoId}?wmode=Opaque`}
              opts={opts}
              onReady={this._onReady}
              onStateChange={this._onPlayerStateChange}
              containerClassName="youtube-video"
            />
            {(isPaused && isCropping) && (
              <Rector
                width={WIDTH}
                height={HEIGHT}
                onSelected={this.onSelected}
              />
            )}
          </div>
        </div>
        <div className=" column">
          <h1>Current timestamp: {currentTime}</h1>
          <p>
            <textarea value={ocrText} />
          </p>
          {isPaused && (
            <React.Fragment>
              <button type="button" onClick={this.onGenerateBtnClick}>
                Generate OCR text
              </button>
              <button type="button" onClick={this.toggleCrop}>
                Turn Cropping {isCropping ? 'Off': 'On'}
              </button>
            </React.Fragment>
          )}
          <p>
            x: {this.state.x}, y: {this.state.y}, w: {this.state.w}, h: {this.state.h},
          </p>
          {image && <img src={`data:image/jpeg;base64,${image}`} />}
        </div>
      </div>
    )
  }

  // YOUTUBE API REFERENCE
  // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
  // Test video: https://www.youtube.com/watch?v=ed8SzALpx1Q
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }
  _onPlayerStateChange = event => {
    const currentPlayerState = event.target.getPlayerState() // returns a number
    this.setState({currentPlayerState})
    // only record timestamp when player is paused
    if (currentPlayerState === 2) {
      this.props.setCurrentTime(Math.round(event.target.getCurrentTime()))
    }
  }
}

const mapState = state => ({
  videoId: state.youtube.videoId,
  currentTime: state.youtube.currentTime,
  ocrData: state.ocrData,
  image: state.ocrData.image
})
const mapDispatch = dispatch => ({
  setCurrentTime: time => dispatch(setCurrentTime(time)),
  resetYoutube: () => dispatch(resetYoutube()),
  clearOcrState: () => dispatch(clearOcrState()),
  generateOcrData: (videoId, time) => dispatch(generateOcrData(videoId, time))
})
export default connect(mapState, mapDispatch)(MainPage)
