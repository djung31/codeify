import axios from 'axios'

const initialState = '';

// action types
const SET_OCR_TEXT = 'SET_OCR_TEXT';
const CLEAR_OCR_TEXT = 'CLEAR_OCR_TEXT';

// action creators
export const setOcrText = (text) => ({
  type: SET_OCR_TEXT,
  text
})
const clearOcrText = () => ({
  type: CLEAR_OCR_TEXT
})

// thunk
export const generateOcrText = (videoId, time) => async dispatch => {
  const {data} = await axios.get(`/api/youtube?videoId=${videoId}&t=${time}`)
  const action = setOcrText(data);
  dispatch(action);
}

//handler
const handler = {
  [SET_OCR_TEXT]: (state, action) => {
    return action.text
  },
  [CLEAR_OCR_TEXT]: (state, action) => {
    return action.initialState
  }
}

// reducer
const ocrTextReducer = (state = initialState, action) => {
  if (!handler.hasOwnProperty(action.type)) {
    return state
  } else {
    return handler[action.type](state, action)
  }
}

export default ocrTextReducer;
