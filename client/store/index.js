import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import youtube from './youtube'
import ocrData from './ocrData'
import gifmaker from './gifmaker'
const reducer = combineReducers({user, youtube, ocrData, gifmaker})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './youtube'
export * from './ocrData'
export * from './gifmaker'
