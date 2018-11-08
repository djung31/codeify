// initial state
const initialState = {
  videoId: '',
}

// action types

const SET_VIDEO_ID = "SET_VIDEO_ID";
const CLEAR_VIDEO_ID = "CLEAR_VIDEO_ID";

// action creators

export const setVideoId = (videoId) => ({
  type: SET_VIDEO_ID,
  videoId
})

export const clearVideoId = () => ({
  type: CLEAR_VIDEO_ID
})

// thunks

// handler
const handler = {
  [SET_VIDEO_ID]: (state, action) => {
    return {
      videoId: action.videoId
    }
  },
  [CLEAR_VIDEO_ID]: (state, action) => {
    return {...initialState}
  }
}

// reducer
const youtubeReducer = (state = initialState, action) => {
  if (!handler.hasOwnProperty(action.type)) {
    return state
  } else {
    return handler[action.type](state, action)
  }
}

export default youtubeReducer;
