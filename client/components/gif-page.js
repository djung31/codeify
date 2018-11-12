import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  setGifVideoId,
  setGifPendingTrue,
  setShowToolbarTrue,
  setShowToolbarFalse
} from '../store'

class GifPage extends Component {
  state = {
    url: '',
    showToolbarChecked: false
  }
  onChange = event => {
    this.setState({url: event.target.value})
  }
  handleCheck = () => {
    const curVal = this.state.showToolbarChecked
    this.setState({showToolbarChecked: !curVal})
  }

  onClick = async event => {
    event.preventDefault()
    const videoId = this.parseUrl(this.state.url)
    await this.props.setGifVideoId(videoId)
    this.state.showToolbarChecked
      ? await this.props.setShowToolbarTrue()
      : await this.props.setShowToolbarFalse()
    await this.props.setGifPendingTrue()
    await this.setState({url: ''})
    this.props.history.push('/gifresult')
  }

  onClickTens = event => {
    event.preventDefault()
    const videoId = this.parseUrl(this.state.url)
    this.props.setGifVideoId(videoId)
    this.state.showToolbarChecked
      ? this.props.setShowToolbarTrue()
      : this.props.setShowToolbarFalse()
    this.props.setGifPendingTrue()
    this.setState({url: ''})
    this.props.history.push('/gifresulttens')
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
            <li>
              Enter a Youtube video URL into the field below and click submit
            </li>
            <li>example url: https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
          </ul>
          <form>
            <input
              type="text"
              onChange={this.onChange}
              value={this.state.url}
              placeholder="Copy a YouTube link here"
            />
            <button type="button" onClick={this.onClick}>
              Submit
            </button>
            <button type="button" onClick={this.onClickTens}>
              Make long gif
            </button>
          </form>
          <label>
            <input
              type="checkbox"
              onChange={this.handleCheck}
              checked={this.state.showToolbarChecked}
            />
            Show Youtube Controls
          </label>
        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  setGifVideoId: videoId => dispatch(setGifVideoId(videoId)),
  setGifPendingTrue: () => dispatch(setGifPendingTrue()),
  setShowToolbarTrue: () => dispatch(setShowToolbarTrue()),
  setShowToolbarFalse: () => dispatch(setShowToolbarFalse())
})

export default connect(null, mapDispatch)(GifPage)
