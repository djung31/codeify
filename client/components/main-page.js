import React, {Component} from 'react'
import {connect} from 'react-redux'
import {clearOcrState, resetYoutube, setCurrentTime, generateOcrData} from '../store'
import YouTube from 'react-youtube'

class MainPage extends Component {
  constructor() {
    super()
    this.state = {
      currentPlayerState: NaN
    }
  }
  componentWillUnmount() {
    this.props.resetYoutube()
    this.props.clearOcrState()
  }

  onClick = () => {
    const {videoId, currentTime} = this.props
    this.props.generateOcrData(videoId, currentTime)
  }

  render() {
    const {videoId, ocrData, currentTime} = this.props
    const {ocrText, image, visionData} = ocrData;
    const opts = {
      height: '360',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    }
    const isPaused = (this.state.currentPlayerState === 2);

    return (
      <div>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={this._onReady}
          onStateChange={this._onPlayerStateChange}
        />
        <div>
          <h1>Current timestamp: {currentTime}</h1>
          <p><textarea value={ocrData.ocrText} /></p>
          {isPaused && (<button type="button" onClick={this.onClick}>
            Generate OCR text
          </button>)}
          {(image) && <img src={`data:image/jpeg;base64,${image}`} />}
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
