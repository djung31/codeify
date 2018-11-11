import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  resetGifmaker, generateGif
} from '../store'

class GifResult extends Component {
  componentDidMount() {
    this.props.generateGif(this.props.videoId);
  }
  componentWillUnmount() {
    this.props.resetGifMaker()
  }

  render() {
    const {pending, data} = this.props
    return (
      <div>
        <h1>Gif Result goes here</h1>
        {pending && <h1>Loading</h1>}
        {!pending && data.map((image, idx) => {
          return (
            <img key={`key ${idx}`} src={`data:image/png;base64,${image}`} />
          )
        })}
      </div>
    )
  }
}

const mapState = state => ({
  pending: state.gifmaker.pending,
  data: state.gifmaker.data,
  videoId: state.gifmaker.videoId
})
const mapDispatch = dispatch => ({
  resetGifmaker: () => dispatch(resetGifmaker()),
  generateGif: (videoId) => dispatch(generateGif(videoId))
})
export default connect(mapState, mapDispatch)(GifResult)
