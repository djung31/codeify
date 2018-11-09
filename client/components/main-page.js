import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setOcrText, clearOcrText, resetYoutube, setCurrentTime} from '../store'
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
    this.props.clearOcrText()
  }

  onClick = () => {
    this.props.setOcrText('Lorem Ipsum')
  }

  render() {
    const {videoId, ocrText, currentTime} = this.props
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
          <p><textarea value={ocrText} /></p>
          {isPaused && (<button type="button" onClick={this.onClick}>
            Lorem Ipsum
          </button>)}
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
  ocrText: state.ocrText
})
const mapDispatch = dispatch => ({
  setOcrText: text => dispatch(setOcrText(text)),
  setCurrentTime: time => dispatch(setCurrentTime(time)),
  resetYoutube: () => dispatch(resetYoutube()),
  clearOcrText: () => dispatch(clearOcrText())
})
export default connect(mapState, mapDispatch)(MainPage)
