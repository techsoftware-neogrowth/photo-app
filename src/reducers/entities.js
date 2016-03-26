let lodObj = require('lodash');
import * as types from '../constants/AppActionTypes'


const initialState = {
  myLeads: {},
  assignedLeads: {}
};

export default function entitiesReducer(state = initialState, action) {
    if (action.entities) {
      //console.log(lodObj.mergeWith({}, state, action.entities));
      if(action.type == types.DATA_FLUSH) {
        delete state.myLeads[action.lead];
        // return lodObj.omitBy(state, action.entities);
        return state;
      }
      return lodObj.mergeWith({}, state, action.entities);
    }
    return state;
}
