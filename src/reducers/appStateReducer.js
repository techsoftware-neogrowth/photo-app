let lodObj = require('lodash/fp/object');

import * as types from '../constants/AppActionTypes'

const initialState = {
  isLoggedIn: true,
  user: {
    name: 'Akshay',
    id: '12345'
  },
  isNetworkAvailable: true
};

export default function appStateReducer(state = initialState, action) {
    switch(action.type) {
      case types.NO_NETWORK:
        return Object.assign({}, state, {
          isNetworkAvailable: false
        })

      case types.YES_NETWORK:
        return Object.assign({}, state, {
          isNetworkAvailable: true
        })

      case types.USER_LOGGED_IN:
        return Object.assign({}, state, {
          isLoggedIn: true,
          user: action.user
        })

      case types.USER_LOGGED_OUT:
        return Object.assign({}, state, {
          isLoggedIn: false,
          user: null
        })

      default:
        return state
    }
}
