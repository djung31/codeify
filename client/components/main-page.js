import React from 'react'
import {connect} from 'react-redux'

const MainPage = props => {
  const videoId = props.videoId;
  return (
    <iframe
      width="420"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
    />
  )
}

const mapState = state => ({
  videoId: state.youtube.videoId
})

export default connect(mapState)(MainPage);
