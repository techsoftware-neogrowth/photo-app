import * as types from '../constants/LeadListsActionTypes'
import * as AppActionTypes from '../constants/AppActionTypes'
let lodObj = require('lodash');

function individualLeadList(state = {
  isFetching: false,
  isPosting: false,
  leads: [],
  nextUrl: false
}, action) {

  switch(action.type) {

  case types.REQUEST_LEADS:
    return Object.assign({}, state, {
      isFetching: true,
      nextUrl: null
    })

  case types.RECEIVE_LEADS:
    return Object.assign({}, state, {
      isFetching: false,
      leads: [...state.leads, ...action.leads],
      nextUrl: action.nextUrl
    });

  case types.REQUEST_LEAD_ADD:
    return Object.assign({}, state, {
      isPosting: true
    })

  case types.ADD_LEAD:
    let newLeads = [...state.leads];
    newLeads.unshift(action.lead);
    return Object.assign({}, state, {
      isPosting: false,
      leads : newLeads
    })

  case types.REQUEST_LEAD_UPDATE:
    return Object.assign({}, state, {
      isPosting: true
    })

  case types.UPDATE_LEAD:
    let leads = [...state.leads];
    leads[action.leadIndex] = action.lead;
    return Object.assign({}, state, {
      isPosting: false,
      leads: leads
    })

  // case types.UPDATE_LEAD_BK:
  //   let leads = [...state.leads];
  //   var index = leads.indexOf(action.lead);
  //   if(index > -1) {
  //     leads[index] = action.lead
  //   }
  //   leads[index] = action.lead;
  //   return Object.assign({}, state, {
  //     isPosting: false,
  //     leads: leads
  //   })

  case AppActionTypes.DATA_FLUSH:
    // let leftLeads = [...state.leads];
    // leftLeads = lodObj.difference(leftLeads, action.lead);
    // console.log(leftLeads, ' leftLeads');
    var index = state.leads.indexOf(action.lead)
    if (index > -1) {
      state.leads.splice(index, 1);
    }

    return state;

  default:
    return state
  }
}

export default function leadListsReducer(state = {}, action) {
  //console.log('*******')
  ////console.log(action);
  switch(action.type) {

  case types.REQUEST_LEADS:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case types.RECEIVE_LEADS:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case types.REQUEST_LEAD_ADD:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case types.ADD_LEAD:
  //console.log(action);
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case types.REQUEST_LEAD_UPDATE:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case types.UPDATE_LEAD:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  case AppActionTypes.DATA_FLUSH:
    return Object.assign({}, state, {
      [action.leadlist]: individualLeadList(state[action.leadlist], action)
    })

  default:
    return state
  }
}
