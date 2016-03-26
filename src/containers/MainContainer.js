const React = require('react-native');

let {
  View,
  Component
} = React
import {connect} from 'react-redux'

import Main from '../components/Main'

class MainContainer extends Component {
  render() {
    return (
      <Main {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const { leadListReducer, currentIndexReducer, leadListsReducer, entitiesReducer, appStateReducer} = state

  return {
    leadListReducer,
    leadListsReducer,
    entitiesReducer,
    currentIndexReducer,
    appStateReducer
  }
}

export default connect(mapStateToProps)(MainContainer)
