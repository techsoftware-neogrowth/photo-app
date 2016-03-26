import React from 'react-native'

let {
  View,
  Component
} = React
import {connect} from 'react-redux'

import LeadEdit from '../components/LeadEdit'

class LeadEditContainer extends Component {
  render() {
    return (
      <LeadEdit {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { leadListReducer, leadListsReducer, currentIndexReducer, entitiesReducer} = state

  return {
    leadListReducer,
    leadListsReducer,
    entitiesReducer,
    currentIndexReducer,
  }
}

export default connect(mapStateToProps)(LeadEditContainer)
