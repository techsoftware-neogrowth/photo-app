import React from 'react-native'
let {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  Picker,
  ToolbarAndroid,
  TouchableWithoutFeedback,
  TouchableOpacity
} = React

import Icon from 'react-native-vector-icons/MaterialIcons'
import InteractionManager from 'InteractionManager'

import {editLead} from '../actions/leadlists'
import LeadEditContainer from '../containers/LeadEditContainer'
import ImagePicker from './utility/imagePicker';


let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

let toolbarActions = [
  {title: 'edir', icon: require('image!ic_mode_edit_white_48dp'), show:'always'}
]


class LeadDisplay extends React.Component {
  constructor (props) {
    super(props)
  }

  editLead() {
    const {leadListReducer, currentIndexReducer, dispatch, navigator} = this.props

    InteractionManager.runAfterInteractions(() => {
      dispatch(editLead(leadListReducer, currentIndexReducer))
      navigator.push({
        component: LeadEditContainer,
        name: 'Song'
      })
    })
  }

  onActionSelected (position) {
    const { navigator } = this.props
    InteractionManager.runAfterInteractions(() => {
      if (position === 0) {
        this.editLead();
      }
    })
  }

  render () {
    const {leadListReducer, leadListsReducer, entitiesReducer, currentIndexReducer, navigator} = this.props
    let leadId = leadListsReducer[leadListReducer].leads[currentIndexReducer];
    const lead = entitiesReducer[leadListReducer][leadId];

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={require('image!icons_back_arrow')}
          actions={toolbarActions}
          onActionSelected={this.onActionSelected.bind(this)}
          onIconClicked={() => this.props.navigator.pop()}
          titleColor='#fff'
          title={lead.merchantName}
        />



        <ScrollView style={[styles.container, styles.detailsContainer]} contentContainerStyle={styles.detailsContainerContent}>
          <View style={styles.description}>
            <View style={styles.imageContainer}>
              <ImagePicker ref={(ref) => this.imageComp = ref} viewOnly={true} title="Lead Photo" takePhotoButtonTitle="Camera" data={false} noData={true} chooseFromLibraryButtonTitle="Library" picture={lead.picture} defaultPicture={lead.picture}/>
            </View>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Merchant Name</Text>
            <Text
            style={styles.baseText}
            >{lead.merchantName}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Contact Person</Text>
            <Text
            style={styles.baseText}
            >{lead.contactPerson}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Phone</Text>
            <Text
            style={styles.baseText}
            >{lead.phone}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Email</Text>
            <Text
            style={styles.baseText}
            >{lead.email}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Industry</Text>
            <Text
            style={styles.baseText}
            >{lead.industry}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Address</Text>
            <View style={styles.container}>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <Text
                style={styles.baseText}
                >{lead.address1}</Text>
              </View>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <Text
                style={styles.baseText}
                >{lead.address2}</Text>
              </View>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <Text
                style={styles.baseText}
                >{lead.address3}</Text>
              </View>

            </View>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Pincode</Text>
            <Text
            style={styles.baseText}
            >{lead.pincode}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Appointment</Text>
              <Text
              style={styles.baseText}
              >{lead.appointmentDate ? new Date(lead.appointmentDate).toLocaleDateString() : 'No Appointment'}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  toolbar: {
    backgroundColor: '#68000A',
    height: 50,
  },
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    height: null
  },
  description: {
    flex: 1,
    flexDirection: 'column'
  },
  back: {
    flex: 1,
    fontSize: 12,
    color: '#E2E2E2',
    margin: 20
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    padding: 5,
  },
  username: {
    fontSize: 12,
    color: '#E2E2E2'
  },
  heading: {
    flexWrap: 'wrap',
    color: '#fff',
    fontSize: 14,
    padding: 5
  },
  title: {
    flexWrap: 'wrap',
    color: '#fff',
    fontSize: 14
  },
  player: {
    height:30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    // borderTopColor: 'red',
    // borderBottomColor: 'yellow',
    // borderBottomWidth: 3,
    // borderTopWidth: 3
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    padding: 5
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center'
 },
 resizeMode: {
   flex: 1,
   flexDirection: 'row',
   backgroundColor: '#f9f9f9',
   alignItems: 'center',
   height:100,
   width: 200
 },
 detailsContainer: {
   backgroundColor: '#ffffff',
   flexDirection: 'column',
   flex: 3,
   paddingTop: 10
 },
 detailsContainerContent: {

},
 messageBox:{
   flexDirection: 'row',
   flex: 1,
   padding: 10,
   marginLeft: 10,
   marginRight: 10,
   borderBottomWidth: 1,
   borderBottomColor: '#CCCCCC'
 },

 baseLabel: {
   flexWrap: 'wrap',
   color: '#3a3f41',
   padding: 5,
   flex: 0.5
 },

 baseText: {
   flex: 0.5,
   flexWrap: 'wrap',
   padding: 5
 }
})

LeadDisplay.propTypes = {
  dispatch: PropTypes.func.isRequired,
  leadListReducer: PropTypes.string.isRequired,
  entitiesReducer: PropTypes.object.isRequired,
  leadListsReducer: PropTypes.object.isRequired
}

export default LeadDisplay
