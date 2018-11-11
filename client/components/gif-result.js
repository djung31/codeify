import React, {Component} from 'react'
import {connect} from 'react-redux'
import {resetGifmaker, generateGif} from '../store'
import gifshot from 'gifshot'
class GifResult extends Component {
  componentDidMount() {
    this.props.generateGif(this.props.videoId)
  }
  componentWillUnmount() {
    this.props.resetGifMaker()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pending !== this.props.pending) {
      console.log('component did update')
      gifshot.createGIF(
        {
          'gifWidth': 426,
          'gifHeight': 239,
          'frameDuration': 5,
          images: this.props.data.map(base64=> `data:image/png;base64,${base64}`)
        },
        function(obj) {
          if (!obj.error) {
            const image = obj.image,
            animatedImage = document.createElement('img')
            animatedImage.src = image
            document.body.appendChild(animatedImage)
          }
        }
      )
    }
  }

  render() {
    const {pending, data} = this.props
    return (
      <div>
        <h1>Gif Result goes here</h1>
        {pending && <h1>Loading</h1>}
        {!pending &&
          data.map((image, idx) => {
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
  generateGif: videoId => dispatch(generateGif(videoId))
})
export default connect(mapState, mapDispatch)(GifResult)
