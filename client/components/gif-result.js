import React, {Component} from 'react'
import {connect} from 'react-redux'
import {resetGifmaker, generateGif} from '../store'
import gifshot from 'gifshot'
class GifResult extends Component {
  constructor() {
    super()
    this.state = {
      showThumbs: true,
    }
  }
  componentDidMount() {
    console.log(this.props.videoId, this.props.showToolbar)
    this.props.generateGif(this.props.videoId, this.props.showToolbar)
  }
  componentWillUnmount() {
    this.props.resetGifMaker()
  }
  componentDidUpdate(prevProps) {
    function getPngDimensions(base64) {
      const header = atob(base64.slice(0, 50)).slice(16, 24)
      const uint8 = Uint8Array.from(header, c => c.charCodeAt(0))
      const dataView = new DataView(uint8.buffer)
      return {
        width: dataView.getInt32(0),
        height: dataView.getInt32(4)
      }
    }
    if (prevProps.pending !== this.props.pending) {
      const {width, height} = getPngDimensions(this.props.data[0])
      const images = this.props.data.map(
        base64 => `data:image/png;base64,${base64}`
      )
      gifshot.createGIF(
        {
          gifWidth: width,
          gifHeight: height,
          frameDuration: 5,
          images: images
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

  toggleThumbs = () => {
    const curVal = this.state.showThumbs
    this.setState({showThumbs: !curVal})
  }

  render() {
    const {pending, data} = this.props
    const showThumbs = this.state
    if (pending)
      return (
        <div>
          <h1>Gif Result goes here</h1>
          <h1>Loading</h1>
        </div>
      )
    if (showThumbs)
      return (
        <div>
          <h1>Gif Result goes here</h1>
          <button type="button" onClick={this.toggleThumbs}>
            Show thumbnails
          </button>
          {
            <div>
              {data.map((image, idx) => {
                return (
                  <img
                    key={`key ${idx}`}
                    src={`data:image/png;base64,${image}`}
                  />
                )
              })}
            </div>
          }
        </div>
      )

    if (!showThumbs)
      return (
        <div>
          <h1>Gif Result goes here</h1>
          <button type="button" onClick={this.toggleThumbs}>
            Show thumbnails
          </button>
        </div>
      )
  }
}

const mapState = state => ({
  pending: state.gifmaker.pending,
  data: state.gifmaker.data,
  videoId: state.gifmaker.videoId,
  showToolbar: state.gifmaker.showToolbar
})
const mapDispatch = dispatch => ({
  resetGifmaker: () => dispatch(resetGifmaker()),
  generateGif: (videoId, showToolbar) => dispatch(generateGif(videoId, showToolbar))
})
export default connect(mapState, mapDispatch)(GifResult)
