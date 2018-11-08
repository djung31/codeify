import React from 'react'
import {connect} from 'react-redux'
import {setOcrText} from '../store'

const MainPage = props => {
  const {videoId, ocrText} = props;
  const onClick = () => {
    props.setOcrText('Lorem Ipsum');
  }
  return (
    <div>
      <iframe
        width="1280"
        height="720"
        src={`https://www.youtube.com/embed/${videoId}`}
      />
      <textarea value={ocrText} />
      <button type="button" onClick={onClick}>Lorem Ipsum</button>
    </div>
  )
}

const mapState = state => ({
  videoId: state.youtube.videoId,
  ocrText: state.ocrText
})
const mapDispatch = dispatch => ({
  setOcrText: (text) => dispatch(setOcrText(text))
})
export default connect(mapState, mapDispatch)(MainPage)
