import * as LeadListActionTypes from '../constants/LeadListActionTypes'
import * as LeadListsActionTypes from '../constants/LeadListsActionTypes'
//import {DB_PROVIDER} from '../constants/Config'
import {DB_PROVIDER} from '../constants/Config'
import {arrayOf, normalize, Schema} from 'normalizr'
let lodObj = require('lodash/fp/object');

function fetchLeads(leadListsReducer, leadListReducer, appStateReducer) {
  //console.log('in fetch leads');
  //console.log(leadListsReducer,'----leadListsReducer');
  return (dispatch, getState) => {
    //console.log(leadListsReducer, ' --3  leadListsReducer ');
    dispatch(getRequestLeadsAction(leadListReducer))
    DB_PROVIDER.fetchLeads(leadListsReducer, leadListReducer, dispatch, appStateReducer).then(function(data) {
      // //console.log(data, ' -- whole new world');
      // delete data.nextUrl
      let leadSchema = new Schema(leadListReducer , { idAttribute: '_id' });
      const normalized = normalize(data.leads, arrayOf(leadSchema));
      // console.log(normalized)
      dispatch(getReceiveLeadsAction(normalized.entities, normalized.result, data.nextUrl, leadListReducer))

    });
    //.then(function(leads, nextUrl) {
    //   let leadsSchema = new Schema(leadListReducer, { idAttribute: '_id' });
    //   const normalized = normalize(rows, arrayOf(leadsSchema));
    //   dispatch(getReceiveLeadsAction(normalized.entities, normalized.result, nextUrl, leadListReducer))
    // });
  };
}

//function getDBPro

function shouldFetchLeads(leadListsReducer, leadlist, appStateReducer) {
  const activeLeadList = leadListsReducer[leadlist]
  if (!activeLeadList || !activeLeadList.isFetching && (appStateReducer.isNetworkAvailable && (activeLeadList.nextUrl && activeLeadList.nextUrl !== null))) {
    return true
  }
  return false
}

export function fetchLeadsIfNeeded(leadlist) {
  return (dispatch, getState) => {
    const {leadListsReducer, entitiesReducer, appStateReducer} = getState()
    //console.log(leadListsReducer, '   --   leadListsReducer  9999');
    //console.log(shouldFetchLeads(leadListsReducer, leadlist, appStateReducer), '- should fetch');
    //console.log(leadListsReducer, '   --   leadListsReducer  88888');

    if (shouldFetchLeads(leadListsReducer, leadlist, appStateReducer)) {
      //console.log(leadListsReducer, '  -   leadListsReducer  kjkh');
      return dispatch(fetchLeads(leadListsReducer, leadlist, appStateReducer))
    }
  }
}

export function getChangeLeadListAction(leadListLinkName) {
  return {
    type: LeadListActionTypes.CHANGE_LEAD_LIST,
    leadlist: leadListLinkName
  }
}

export function getReceiveLeadsAction(entities, leads, nextUrl, leadlist) {
  return {
    type: LeadListsActionTypes.RECEIVE_LEADS,
    entities,
    nextUrl,
    leadlist,
    leads
  }
}

export function getRequestLeadsAction(leadlist) {
  return {
    type: LeadListsActionTypes.REQUEST_LEADS,
    leadlist: leadlist
  }
}

export function getShowLeadAction(leadListReducer, leadIndex) {
    return {
        type: LeadListsActionTypes.SHOW_LEAD,
        leadListReducer,
        leadIndex
    };
}

export function showLead(leadListReducer, leadIndex) {
    return (dispatch, getState) => {
        dispatch(getShowLeadAction(leadListReducer, leadIndex));
    };
}

export function getEditLeadAction(leadListReducer, leadIndex) {
    return {
        type: LeadListsActionTypes.EDIT_LEAD,
        leadListReducer,
        leadIndex
    };
}

export function editLead(leadListReducer, leadIndex) {
    return (dispatch, getState) => {
        dispatch(getEditLeadAction(leadListReducer, leadIndex));
    };
}

export function getAddLeadAction(entities, lead, leadListReducer) {
    return {
        type: LeadListsActionTypes.ADD_LEAD,
        entities,
        leadlist: leadListReducer,
        lead
    };
}

export function addLead(leadListReducer, newData) {
  return (dispatch, getState) => {
      return dispatch(addLead2(leadListReducer, newData))
  };
}

function addLead2(leadListReducer, newData) {
  return (dispatch, getState) => {
    //dispatch(getRequestLeadsAction(leadListReducer))
    //dispatch(getUpdateLeadAction(leadListReducer, leadIndex, newData));
    DB_PROVIDER.addLead(leadListReducer, newData).then(function(lead) {
      let leadSchema = new Schema(leadListReducer , { idAttribute: '_id' });
      const normalized = normalize(lead, leadSchema);
//console.log(normalized, '  - normalized in add');
      dispatch(getAddLeadAction(normalized.entities, normalized.result, leadListReducer));
    });
  }
}

export function getUpdateLeadAction(entities, lead, leadListReducer, leadIndex) {
    return {
        type: LeadListsActionTypes.UPDATE_LEAD,
        entities,
        leadlist: leadListReducer,
        leadIndex,
        lead
    };
}

export function getUpdateLeadAction2(entities, lead, leadListReducer) {
    return {
        type: LeadListsActionTypes.UPDATE_LEAD_BK,
        entities,
        leadlist: leadListReducer,
        lead
    };
}

export function updateLead(leadListReducer, leadIndex, newData) {
    return (dispatch, getState) => {
        return dispatch(updateLead2(leadListReducer, leadIndex, newData))
    };
}

function updateLead2(leadListReducer, leadIndex, newData) {
  return (dispatch, getState) => {
    //dispatch(getRequestLeadsAction(leadListReducer))
    //dispatch(getUpdateLeadAction(leadListReducer, leadIndex, newData));
    DB_PROVIDER.updateLead(leadListReducer, leadIndex, newData).then(function(updated, isAdd) {
      let leadSchema = new Schema(leadListReducer , { idAttribute: '_id' });
      const normalized = normalize(updated, leadSchema);
//console.log(normalized, '  - normalized in add');
      if(isAdd) {
          dispatch(getAddLeadAction(normalized.entities, normalized.result, leadListReducer));
      }else {
          dispatch(getUpdateLeadAction(normalized.entities, normalized.result, leadListReducer, leadIndex));
      }
    });
  };
}
