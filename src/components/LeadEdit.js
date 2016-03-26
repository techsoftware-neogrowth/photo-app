import React from 'react-native'
let {
  StyleSheet,
  PropTypes,
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  DatePickerAndroid,
  Picker,
  MapView,
  ToolbarAndroid
} = React
var _ = require('lodash');

import Icon from 'react-native-vector-icons/MaterialIcons'
import ProgressBar from 'ProgressBarAndroid'
import InteractionManager from 'InteractionManager'

import { updateLead } from './../actions/leadlists'
import ImagePicker from './utility/imagePicker';

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

let toolbarActions = [
  {title: 'discard changes', icon: require('../../assets/search100.png')},
  {title: 'save', icon: require('../../assets/search100.png')}
]

class LeadEdit extends React.Component {
  watchID = (null: ?number);

  constructor (props) {
    super(props);
    this.state = {};
    const {leadListReducer, leadListsReducer, entitiesReducer, currentIndexReducer, navigator} = this.props
    let leadId = leadListsReducer[leadListReducer].leads[currentIndexReducer];
    const lead = entitiesReducer[leadListReducer][leadId];

    if(lead) {
        this.state = Object.assign(this.state, lead);
    }
 }

  updateLead() {
    const {leadListReducer, currentIndexReducer, dispatch, navigator} = this.props;
    navigator.pop();

    InteractionManager.runAfterInteractions(() => {
      dispatch(updateLead(leadListReducer, currentIndexReducer, this.state))
    })
  }

  mergeContent(data) {
    this.setState(_.merge(this.state, data));
  }

  onActionSelected (position) {
    const { navigator } = this.props
    InteractionManager.runAfterInteractions(() => {
      if (position === 0) {
        navigator.pop();
      }else if(position === 1) {
        this.updateLead();
      }
    })
  }

  async showPicker(stateKey, options) {
   try {
     var newState = {};
    //  const {action, year, month, day} = await DatePickerAndroid.open(options);
    //  if (action === DatePickerAndroid.dismissedAction) {
    //    newState[stateKey + 'Text'] = 'dismissed';
    //  } else {
    //    var date = new Date(year, month, day);
    //    newState[stateKey + 'Text'] = date.toLocaleDateString();
    //    newState[stateKey + 'Date'] = date;
    //  }
    //  console.log(newState)
    var self = this;
      DatePickerAndroid.open(options).then(function(data) {
        const {action, year, month, day} = data;
        if (action === DatePickerAndroid.dismissedAction) {

         } else {
           var date = new Date(year, month, day);
           self.mergeContent({appointmentDate: date.getTime()});
         }
      })

     //this.setState(newState);
   } catch ({code, message}) {
     console.warn(`Error in example '${stateKey}': `, message);
   }
 }

  render () {

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={require('image!icons_check_mark')}
          actions={toolbarActions}
          onActionSelected={this.onActionSelected.bind(this)}
          onIconClicked={this.updateLead.bind(this)}
          titleColor='#fff'
          title={this.state.merchantName}
          overflowIcon={require('image!icons_offscreen_menu')}
        />

        <ScrollView style={[styles.container, styles.detailsContainer]} contentContainerStyle={styles.detailsContainerContent}>
          <View style={styles.description}>
            <View style={styles.imageContainer}>
              <ImagePicker title="Lead Photo" takePhotoButtonTitle="Camera" data={true} noData={false} chooseFromLibraryButtonTitle="Library" defaultPicture={this.state.picture} onChange={(picture) => {this.mergeContent({picture: picture})}}/>
            </View>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Merchant Name</Text>
            <TextInput
            style={styles.baseText}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {this.mergeContent({merchantName: text})}}
            value={this.state.merchantName}></TextInput>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Contact Person</Text>
            <TextInput
            style={styles.baseText}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {this.mergeContent({contactPerson: text})}}
            value={this.state.contactPerson}></TextInput>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Phone</Text>
            <TextInput
            style={styles.baseText}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {this.mergeContent({phone: text})}}
            value={this.state.phone}></TextInput>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Email</Text>
            <TextInput
            style={styles.baseText}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {this.mergeContent({email: text})}}
            value={this.state.email}></TextInput>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Industry</Text>
              <Picker
                  style={styles.dropdown}
                  selectedValue={this.state.industry}
                  onValueChange={(text) => this.setState({industry: text})}>
                  <Picker.Item label="Home Appliances" value="Home Appliances" />
                  <Picker.Item label="Computers and IT Accessories" value="Computers and IT Accessories" />
                  <Picker.Item label="Cosmetics" value="Cosmetics" />
                  <Picker.Item label="Groceries" value="Groceries" />
                  <Picker.Item label="Hardware" value="Hardware" />
                  <Picker.Item label="Sports Equipment" value="Sports Equipment" />
                  <Picker.Item label="Others" value="Others" />
              </Picker>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Address</Text>
            <View style={styles.container}>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <TextInput
                style={styles.baseText}
                onChangeText={(text) => {this.mergeContent({address1: text})}}
                value={this.state.address1}></TextInput>
              </View>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <TextInput
                style={styles.baseText}
                onChangeText={(text) => {this.mergeContent({address2: text})}}
                value={this.state.address2}></TextInput>
              </View>
              <View style={{borderBottomWidth:1, borderBottomColor: "#9E9E9E"}} >
                <TextInput
                style={styles.baseText}
                onChangeText={(text) => {this.mergeContent({address3: text})}}
                value={this.state.address3}></TextInput>
              </View>

            </View>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Pincode</Text>
            <TextInput
            style={styles.baseText}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {this.mergeContent({pincode: text})}}
            value={this.state.pincode}></TextInput>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>Appointment</Text>
            <TouchableWithoutFeedback
             onPress={this.showPicker.bind(this, 'min', {
               date: new Date(),
               minDate: new Date(),
             })}>
             <Text style={styles.text}>{this.state.appointmentDate ? new Date(this.state.appointmentDate).toLocaleDateString() : 'set now'}</Text>
           </TouchableWithoutFeedback>
          </View>
{/*
          <View style={styles.messageBox}>
            <Text style={styles.baseLabel}>You are here</Text>
              <MapView
                style={styles.map}
                showsUserLocation={true}
                followUserLocation={true}
              />
          </View>
*/}


        </ScrollView>
      </View>
    )
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          var initialPosition = JSON.stringify(position);
          this.setState({position: initialPosition});
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.watchID = navigator.geolocation.watchPosition((position) => {
        console.log(position)
        var lastPosition = JSON.stringify(position);
        //this.setState({position: lastPosition});
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
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
  progressbar: {
    marginTop: 10,
    alignItems: 'center'
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
  color: '#212121',
  padding: 5,
  flex: 0.5,
  fontSize: 14,
  fontWeight: "300",
},

baseText: {
  top:-10,
  flex: 0.5,
  flexWrap: 'wrap',
  padding: 5,
  fontSize: 14,
  fontWeight: "300",
  color: '#757575'
},

dropdown: {
  flex: 1,
  height: 20,
  color: '#68000A'
},

 map: {
   position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
  }
})

LeadEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  leadListsReducer: PropTypes.object.isRequired,
  entitiesReducer: PropTypes.object.isRequired,
  leadListReducer: PropTypes.string.isRequired
}

export default LeadEdit
