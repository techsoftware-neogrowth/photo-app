import React from 'react-native'

let {
  View,
  Component
} = React
import {connect} from 'react-redux'

import Search from '../components/Search'

class SearchContainer extends Component {
  render() {
    return (
      <Search {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { leadListReducer, leadListsReducer, entitiesReducer} = state

  return {
    leadListReducer,
    leadListsReducer,
    entitiesReducer
  }
}

export default connect(mapStateToProps)(SearchContainer)
