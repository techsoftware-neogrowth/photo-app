let React = require('react-native')
let {
  StyleSheet,
  View,
  Dimensions,
  PropTypes,
  ToolbarAndroid,
  TouchableOpacity,
  Image,
  Text
} = React
import {connect} from 'react-redux'

let deviceWidth = Dimensions.get('window').width

import InteractionManager from 'InteractionManager'
import {fetchLeadsIfNeeded} from '../actions/leadlists'
import {parseUrl} from '../utils/RouteUtils'

import SearchContainer from '../containers/SearchContainer'
import LeadAddContainer from '../containers/LeadAddContainer'

import Leads from './Leads'

let toolbarActions = [
  //{title: 'Search', icon: require('../../assets/search100.png'), show: 'always'}
]

class Main extends React.Component {
  constructor (props) {
    super(props)

    this.onActionSelected = this.onActionSelected.bind(this)
  }

  renderContent () {
    const { leadListReducer, appStateReducer } = this.props;
    return (
      <Leads
        {...this.props} style={styles.leads}
        scrollFunc={fetchLeadsIfNeeded.bind(null, leadListReducer)} />
    )
  }

  renderAddButton() {
    ////console.log('rendering add button')
    return (
      <View {...this.props} style={styles.addButton}>
        <TouchableOpacity onPress={this.onAddPress.bind(this)}>
            <Image source={require('image!icons_float_action')}/>
        </TouchableOpacity>
      </View>
    )
  }

  onAddPress() {
    const {leadListReducer, dispatch, navigator} = this.props;
    InteractionManager.runAfterInteractions(() => {
      navigator.push({
        component: LeadAddContainer,
        name: 'Song'
      })
    })
  }

  onActionSelected (position) {
    const { navigator } = this.props
    InteractionManager.runAfterInteractions(() => {
      if (position === 0) {
        navigator.push({
          component: SearchContainer,
          name: 'Search'
        })
      }
    })
  }

  render () {
    const {leadListReducer, dispatch, navigator} = this.props;
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={require('image!icons_back_arrow')}
          actions={toolbarActions}
          onActionSelected={this.onActionSelected}
          titleColor='#fff'
          title={'User Insights Engine'}
        />
        {this.renderContent()}
        {this.renderAddButton()}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  toolbar: {
    backgroundColor: '#68000A',
    height: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  leads: {
    flex: 0.8
  }
})

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  leadListReducer: PropTypes.string.isRequired,
  leadListsReducer: PropTypes.object.isRequired,
  entitiesReducer: PropTypes.object.isRequired,
  appStateReducer: PropTypes.object.isRequired
}

export default Main
