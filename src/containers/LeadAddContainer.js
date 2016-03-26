import React from 'react-native'

let {
  View,
  Component
} = React
import {connect} from 'react-redux'

import LeadAdd from '../components/LeadAdd'

class LeadAddContainer extends Component {
  render() {
    return (
      <LeadAdd {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { leadListReducer, leadListsReducer} = state

  return {
    leadListReducer,
    leadListsReducer
  }
}

export default connect(mapStateToProps)(LeadAddContainer)
