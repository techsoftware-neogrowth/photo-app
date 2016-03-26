import React from 'react-native'

let {
  View,
  Component
} = React
import {connect} from 'react-redux'

import LeadDisplay from '../components/LeadDisplay'

class LeadDisplayContainer extends Component {
  render() {
    return (
      <LeadDisplay {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { leadListReducer, currentIndexReducer, leadListsReducer, entitiesReducer} = state

  return {
    leadListReducer,
    leadListsReducer,
    entitiesReducer,
    currentIndexReducer
  }
}

export default connect(mapStateToProps)(LeadDisplayContainer)
