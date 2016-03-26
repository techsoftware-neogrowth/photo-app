import * as types from '../constants/LeadListActionTypes'
import * as AppConstants from '../constants/AppConstants'

export default function leadListReducer(state = AppConstants.DEFAULT_LEAD_LIST, action) {
  switch(action.type) {
  case types.CHANGE_LEAD_LIST:
    return action.leadlist

  default:
    return state
  }
}
