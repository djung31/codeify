import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setVideoId} from '../store'

class LandingPage extends Component {
  state = {
    url: ''
  }
  onChange = event => {
    this.setState({url: event.target.value})
  }

  onClick = event => {
    event.preventDefault();
    const videoId = this.parseUrl(this.state.url)
    this.props.setVideoId(videoId)
    this.setState({url: ''})
    this.props.history.push('/app');
  }

  // got this from the internet..
  parseUrl (url) {
    let ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }
  render() {
    return (
      <div>
        <h1> landing page goes here</h1>
        <input type="text" onChange={this.onChange} value={this.state.url} placeholder="Put YouTube link here"/>
        <button type="button" onClick={this.onClick} >Submit</button>
      </div>
    )
  }
}

const mapDispatch = (dispatch) => ({
  setVideoId: (videoId) => dispatch(setVideoId(videoId))
})

export default connect(null, mapDispatch)(LandingPage);
