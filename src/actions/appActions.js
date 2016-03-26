import * as AppActionTypes from '../constants/AppActionTypes'

export function getNetworkOnlineAction() {
  return {
    type: AppActionTypes.YES_NETWORK
  }
}

export function getNetworkOfflineAction() {
  return {
    type: AppActionTypes.NO_NETWORK
  }
}

export function getDataFlushSuccess(entities, lead, leadListReducer) {
  return {
    type: AppActionTypes.DATA_FLUSH,
    entities,
    leadlist: leadListReducer,
    lead
  }
}
