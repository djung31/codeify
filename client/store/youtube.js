// initial state
const initialState = {
  videoId: '',
  currentTime: 0
}

// action types

const SET_VIDEO_ID = "SET_VIDEO_ID";
// const CLEAR_VIDEO_ID = "CLEAR_VIDEO_ID";
const SET_CURRENT_TIME = "SET_CURRENT_TIME";
// const CLEAR_CURRENT_TIME = "CLEAR_CURRENT_TIME";
const RESET_YOUTUBE = "RESET_YOUTUBE"
// action creators

export const setVideoId = (videoId) => ({
  type: SET_VIDEO_ID,
  videoId
})

// export const clearVideoId = () => ({
//   type: CLEAR_VIDEO_ID
// })

export const setCurrentTime = (time) => ({
  type: SET_CURRENT_TIME,
  time
})

// export const resetCurrentTime = () => ({
//   type: CLEAR_CURRENT_TIME
// })

export const resetYoutube = () => ({
  type: RESET_YOUTUBE
})

// thunks

// handler
const handler = {
  [SET_VIDEO_ID]: (state, action) => {
    return {
      videoId: action.videoId
    }
  },
  // [CLEAR_VIDEO_ID]: (state, action) => {
  //   return {...initialState}
  // },
  [SET_CURRENT_TIME]: (state, action) => {
    return {...state, currentTime: action.time}
  },
  [RESET_YOUTUBE]: (state, action) => {
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
