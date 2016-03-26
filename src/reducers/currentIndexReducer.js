import * as LeadListsActionTypes from '../constants/LeadListsActionTypes'
import * as LeadListActionTypes from '../constants/LeadListActionTypes'
import * as AppConstants from '../constants/AppConstants'

export default function currentIndexReducer(state = -1, action) {
  switch(action.type) {
  case LeadListsActionTypes.SHOW_LEAD:
    return action.leadIndex

  case LeadListActionTypes.CHANGE_LEAD_LIST:
    return -1

  default:
    return state
  }
}
