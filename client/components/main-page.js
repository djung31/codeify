import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setOcrText} from '../store'
// import {YoutubePlayer} from './index';
import YouTube from 'react-youtube'

class MainPage extends Component {
  onClick = () => {
    this.props.setOcrText('Lorem Ipsum')
  }
  render() {
    const {videoId, ocrText} = this.props
    const opts = {
      height: '360',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    }
    return (
      <div>
        {/* <YoutubePlayer videoId={videoId}/> */}
        <YouTube videoId={videoId} opts={opts} onReady={this._onReady} onStateChange={this._onPlayerStateChange}/>
        <textarea value={ocrText} />
        <button type="button" onClick={this.onClick}>
          Lorem Ipsum
        </button>
      </div>
    )
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }
  _onPlayerStateChange(event) {

  }
}

const mapState = state => ({
  videoId: state.youtube.videoId,
  ocrText: state.ocrText
})
const mapDispatch = dispatch => ({
  setOcrText: text => dispatch(setOcrText(text))
})
export default connect(mapState, mapDispatch)(MainPage)
