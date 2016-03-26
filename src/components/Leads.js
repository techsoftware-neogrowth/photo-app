let React = require('react-native')
let {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ListView,
  TouchableOpacity,
  Component
} = React
import Icon from 'react-native-vector-icons/MaterialIcons'
// import shallowEqual from 'react-pure-render/shallowEqual'
var shallowCompare = require('react-addons-shallow-compare');

import InteractionManager from 'InteractionManager'
import ProgressBar from 'ProgressBarAndroid'
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

import Toolbar from './Toolbar'
import {fetchLeadsIfNeeded, showLead} from '../actions/leadlists'
import LeadDisplayContainer from '../containers/LeadDisplayContainer'

class Leads extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFetchingTail: false
    }

    this.onEndReached = this.onEndReached.bind(this)
    this.showLead = this.showLead.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this.props, nextProps) || shallowCompare(this.state, nextState)
      // !shallowEqual(this.props, nextProps) ||
      // !shallowEqual(this.state, nextState)
    return shouldUpdate
  }

  componentWillMount() {
    const {dispatch, leadListReducer} = this.props;
    dispatch(fetchLeadsIfNeeded(leadListReducer))
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, leadListReducer, leadListsReducer} = this.props

    if (leadListReducer !== nextProps.leadListReducer) {
      if (!(nextProps.leadListReducer in leadListsReducer) || leadListsReducer[nextProps.leadListReducer].leads.length === 0) {
        dispatch(fetchLeadsIfNeeded(nextProps.leadListReducer))
      }
    }
  }

  showLead(i) {
    const {leadListReducer, dispatch, navigator} = this.props
    InteractionManager.runAfterInteractions(() => {
      dispatch(showLead(leadListReducer, i))
      navigator.push({
        component: LeadDisplayContainer,
        name: 'Song'
      })
    })
  }

  onEndReached() {
    this.props.dispatch(this.props.scrollFunc())
  }

  render () {
    const {dispatch, leadListReducer, leadListsReducer, entitiesReducer, route} = this.props
    const isFetching = leadListReducer in leadListsReducer ? leadListsReducer[leadListReducer].isFetching : false

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let dataSource = leadListReducer in leadListsReducer ? ds.cloneWithRows(leadListsReducer[leadListReducer].leads) : ds.cloneWithRows([])

    let leads = entitiesReducer[leadListReducer];

    return (
      <View style={[styles.container]}>

        {
          route.name === 'Main' &&
          <Toolbar dispatch={dispatch} leadListReducer={leadListReducer} />
        }

        { isFetching &&
          <View style={styles.progressbar}>
            <ProgressBar styleAttr='Normal' color="#68000A"/>
          </View>
        }
        <ListView
          pageSize={3}
          style={{marginTop: 5}}
          dataSource={dataSource}
          onEndReached={this.onEndReached}
          renderRow={(leadId, sectionId, rowId) => {
            return (
              <TouchableOpacity onPress={this.showLead.bind(this, parseInt(rowId))}>
                <Image
                 source={require('image!icons_lead_card')}
                //  resizeMode={Image.resizeMode.stretch}
                 style={{flex: 1, flexDirection: 'row', width: deviceWidth, marginBottom: 4}}
               >
                 <View style={styles.card}>
                   <View style={styles.avatar}>
                     <Image
                       key={leads[leadId].id}
                       source={require('./../../android/app/src/main/res/drawable/icons_lead_card_photo.png')}
                     />
                   </View>
                   <View style={styles.description}>
                    <View style={styles.firstRow}>
                       <Text style={[styles.username , {fontSize: 14, color: "#212121", fontWeight: '300'}]}>{leads[leadId].merchantName}</Text>
                       {
                         leads[leadId].opType  && <Image source={require('image!icons_synch')} />
                       }
                     </View>
                     <View style={styles.firstRow}>
                       <Text style={styles.username}>{leads[leadId].contactPerson}</Text>
                     </View>
                     <Text style={styles.username}>{leads[leadId].email}</Text>
                     <View style={styles.countContainer}>
                       <Text style={styles.count}>{leads[leadId].phone}</Text>
                     </View>
                   </View>
                 </View>
                </Image>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f4f4f4'
  },
  progressbar: {
    marginTop: 10,
    alignItems: 'center',
    position: 'absolute',
    left: deviceWidth/2,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  localCard : {
    borderBottomColor: 'blue'
  },
  avatar: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'column'
  },
  firstRow: {
    flexDirection: 'row',
    flex: 0.8,
    justifyContent: 'space-between'
  },
  username: {
    flex:1,
    flexDirection: 'row',
    fontSize: 12,
    fontWeight: '100',
    color: "#757575"
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#757575',
    fontSize: 12
  },
  countContainer: {
    flexDirection: 'row'
  },
  count: {
    fontSize: 10
  }
})

export default Leads
