import axios from 'axios'

const initialState = {
  ocrText: '',
  image: '',
  visionData: {}
};

// action types
const SET_OCR_TEXT = 'SET_OCR_TEXT';
const CLEAR_OCR_STATE = 'CLEAR_OCR_STATE';
const SET_IMAGE_DATA = 'SET_IMAGE_DATA';
const SET_VISION_DATA = 'SET_VISION_DATA';

// action creators
export const setOcrText = (text) => ({
  type: SET_OCR_TEXT,
  text
})
export const clearOcrState = () => ({
  type: CLEAR_OCR_STATE
})

const setImageData = (image) => ({
  type: SET_IMAGE_DATA,
  image
})
const setVisionData = (visionData) => ({
  type: SET_VISION_DATA,
  visionData
})

// thunk
export const generateOcrData = (videoId, time) => async dispatch => {
  const {data} = await axios.get(`/api/youtube?videoId=${videoId}&t=${time}`)
  const image = data.image;
  const visionData = data.data;
  dispatch(setImageData(image));
  dispatch(setVisionData(visionData));
}

//handler
const handler = {
  [SET_OCR_TEXT]: (state, action) => {
    return {
      ...state,
      ocrText: action.text
    }
  },
  [CLEAR_OCR_STATE]: (state, action) => {
    return {...initialState}
  },
  [SET_VISION_DATA]: (state, action) => {
    return {
      ...state,
      visionData: action.visionData
    }
  },
  [SET_IMAGE_DATA]: (state, action) => {
    return {
      ...state,
      image: action.image
    }
  }
}

// reducer
const ocrDataReducer = (state = initialState, action) => {
  if (!handler.hasOwnProperty(action.type)) {
    return state
  } else {
    return handler[action.type](state, action)
  }
}

export default ocrDataReducer;
