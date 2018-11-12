import axios from 'axios'

// initial state
const initialState = {
  videoId: '',
  pending: false,
  data: [],
  showToolbar: false
}

// action types

const SET_GIF_VIDEO_ID = "SET_GIF_VIDEO_ID";
const SET_GIF_PENDING_TRUE = "SET_GIF_PENDING_TRUE"
const SET_GIF_PENDING_FALSE = "SET_GIF_PENDING_FALSE"
const SET_GIF_DATA = "SET_GIF_DATA"
const RESET_GIFMAKER = "RESET_GIFMAKER"
const SET_SHOWTOOLBAR_FALSE = "SET_SHOWTOOLBAR_FALSE"
const SET_SHOWTOOLBAR_TRUE = "SET_SHOWTOOLBAR_TRUE"
// action creators

export const setGifVideoId = (videoId) => ({
  type: SET_GIF_VIDEO_ID,
  videoId
})
export const setGifPendingTrue = () => ({
  type: SET_GIF_PENDING_TRUE
})
export const setGifPendingFalse = () => ({
  type: SET_GIF_PENDING_FALSE
})
export const setGifData = (data) => ({
  type: SET_GIF_DATA,
  data
})
export const resetGifMaker = () => ({
  type: RESET_GIFMAKER
})
export const setShowToolbarFalse = () => ({
  type: SET_SHOWTOOLBAR_FALSE
})
export const setShowToolbarTrue = () => ({
  type: SET_SHOWTOOLBAR_TRUE
})

// thunks
export const generateGif = (videoId, showToolbar) => async dispatch => {
  let {data} = await axios.get(`/api/thumbnail?videoId=${videoId}&showToolbar=${showToolbar}`);
  dispatch(setGifData(data));
  dispatch(setGifPendingFalse());
}

export const generateGifTens = (videoId, showToolbar) => async dispatch => {
  let {data} = await axios.get(`/api/thumbnail/interval-ten?videoId=${videoId}&showToolbar=${showToolbar}`);
  dispatch(setGifData(data));
  dispatch(setGifPendingFalse());
}
// handler
const handler = {
  [SET_GIF_VIDEO_ID]: (state, action) => {
    return {
      ...state,
      videoId: action.videoId
    }
  },
  [SET_GIF_PENDING_TRUE]: (state, action) => {
    return {
      ...state,
      pending: true
    }
  },
  [SET_GIF_PENDING_FALSE]: (state, action) => {
    return {
      ...state,
      pending: false
    }
  },
  [SET_GIF_DATA]: (state, action) => {
    return {
      ...state,
      data: [...action.data]
    }
  },
  [RESET_GIFMAKER]: (state, action) => {
    return {...initialState}
  },
  [SET_SHOWTOOLBAR_FALSE]: (state, action) => {
    return {
      ...state,
      showToolbar: false
    }
  },
  [SET_SHOWTOOLBAR_TRUE]: (state, action) => {
    return {
      ...state,
      showToolbar: true
    }
  },
}

// reducer
const gifmakerReducer = (state = initialState, action) => {
  if (!handler.hasOwnProperty(action.type)) {
    return state
  } else {
    return handler[action.type](state, action)
  }
}

export default gifmakerReducer;
