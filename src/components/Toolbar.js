let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity
} = React

import {getChangeLeadListAction} from '../actions/leadlists'
import {LEAD_LIST_TYPES, LEAD_LIST_TYPES_MAP} from '../constants/AppConstants'
let deviceWidth = Dimensions.get('window').width

class Toolbar extends React.Component {
  constructor (props) {
    super(props)
  }

  onPress (leadListLinkName) {
    //console.log(leadListLinkName)
    const {dispatch} = this.props
    dispatch(getChangeLeadListAction(leadListLinkName))
  }

  render () {
    const { leadListReducer } = this.props

    return (
      <View>
        <ScrollView
          key={'scrollView'}
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          >
          { LEAD_LIST_TYPES.map((g, idx) => {
            return (
              <TouchableOpacity key={idx} style={[styles.item, {
                'borderBottomWidth': g.linkName === leadListReducer ? 2 : 1,
                'borderBottomColor': g.linkName === leadListReducer ? '#4C000A' : '#FFFFFF'
              }]} onPress={this.onPress.bind(this, g.linkName)}>
                <Text style={[styles.genre, {
                    'color' : g.linkName === leadListReducer ? '#212121' : '#757575'
                }]}>
                  {g.displayName}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    height: 40,
    width: deviceWidth,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#e3e3e3'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderLeftColor: '#e3e3e3'
  },
  genre: {
    fontWeight: '300',
    fontSize: 14,
    color: '#adadad',
  }
})

export default Toolbar
