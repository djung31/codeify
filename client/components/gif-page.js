import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setGifVideoId, setGifPendingTrue} from '../store'

class GifPage extends Component {
  state = {
    url: ''
  }
  onChange = event => {
    this.setState({url: event.target.value})
  }

  onClick = event => {
    event.preventDefault()
    const videoId = this.parseUrl(this.state.url)
    this.props.setGifVideoId(videoId)
    this.props.setGifPendingTrue()
    this.setState({url: ''})
    this.props.history.push('/gifresult')
  }

  // got this from the internet..
  parseUrl(url) {
    let ID = ''
    url = url
      .replace(/(>|<)/gi, '')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i)
      ID = ID[0]
    } else {
      ID = url
    }
    return ID
  }
  render() {
    return (
      <div className="columns">
        <div className="column has-text-centered">
          <h1 className="title">gif-ify?</h1>
          <h3 className="subtitle">scrape thumbnails</h3>
          <p>Instructions:</p>
          <ul>
            <li>Enter a Youtube video URL into the field below and click submit</li>
            <li>example url: https://www.youtube.com/watch?v=ed8SzALpx1Q</li>
          </ul>
          <input
            type="text"
            onChange={this.onChange}
            value={this.state.url}
            placeholder="Copy a YouTube link here"
          />
          <button type="button" onClick={this.onClick}>
            Submit
          </button>

        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  setGifVideoId: videoId => dispatch(setGifVideoId(videoId)),
  setGifPendingTrue: () => dispatch(setGifPendingTrue())
})

export default connect(null, mapDispatch)(GifPage)
