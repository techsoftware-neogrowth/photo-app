import {combineReducers} from 'redux'
import entitiesReducer from '../reducers/entities'
import leadListsReducer from '../reducers/leadLists'
import leadListReducer from '../reducers/leadList'
import currentIndexReducer from '../reducers/currentIndexReducer'
import appStateReducer from '../reducers/appStateReducer'

const rootReducer = combineReducers({
  entitiesReducer,
  leadListsReducer,
  leadListReducer,
  currentIndexReducer,
  appStateReducer
})

export default rootReducer
