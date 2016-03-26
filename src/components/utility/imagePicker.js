'use strict';
import React, {
  Component,
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

var ImagePickerManager = require('NativeModules').ImagePickerManager;

class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    if(!props.picture) {
      this.state = {
        picture: props.defaultPicture
      };
    }else {
      this.state = {
        picture: props.picture
      };
    }
  }
  componentWillMount() {

  }
  render () {
    if(this.props.viewOnly === true ) {
      return(
        <View style={styles.imageContainer}>
          <Image
                  style={styles.resizeMode}
                  resizeMode={Image.resizeMode.stretch}
                  source={this.state.picture}
                />
        </View>
      );
    }else {
      return (
        <View style={styles.imageContainer}>
					<TouchableHighlight
            onPress={this.openImagePicker.bind(this)}
            underlayColor='#99d9f4'>
            <Image
					        style={styles.resizeMode}
	              	resizeMode={Image.resizeMode.stretch}
					        source={this.state.picture}
					      />
					</TouchableHighlight>
				</View>
      );
    }
  }

  getImagePickerOptions() {
    var options = {
							  title: this.props.title, // specify null or empty string to remove the title
							  cancelButtonTitle: 'Cancel',
							  takePhotoButtonTitle: this.props.takePhotoButtonTitle, // specify null or empty string to remove this button
							  chooseFromLibraryButtonTitle: this.props.chooseFromLibraryButtonTitle, // specify null or empty string to remove this button
							  // customButtons: {
							  //   'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
							  // },
                customButtons: this.props.customButtons,
							  cameraType: this.props.cameraType, // 'front' or 'back'
							  mediaType: this.props.mediaType, // 'photo' or 'video'
							  videoQuality: this.props.videoQuality, // 'low', 'medium', or 'high'
							  durationLimit: this.props.durationLimit, // video recording max time in seconds
							  maxWidth: this.props.maxWidth, // photos only
							  maxHeight: this.props.maxHeight, // photos only
							  aspectX: this.props.aspectX, // android only - aspectX:aspectY, the cropping image's ratio of width to height
							  aspectY: this.props.aspectY, // android only - aspectX:aspectY, the cropping image's ratio of width to height
							  quality: this.props.quality, // 0 to 1, photos only
							  angle: this.props.angle, // android only, photos only
							  allowsEditing: this.props.allowsEditing, // Built in functionality to resize/reposition the image after selection
							  noData: this.props.noData, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
							  storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
							    skipBackup: true, // ios only - image will NOT be backed up to icloud
							    path: 'images' // ios only - will save image at /Documents/images rather than the root
							  }
							};
      return options;
  }

  openImagePicker() {
		ImagePickerManager.showImagePicker(this.props, this.onImagePickerClose.bind(this));
	}

  onImagePickerClose(response) {
    if (response.didCancel) {
	    ////console.log('User cancelled image picker');
	  }
	  else if (response.error) {
	    ////console.log('ImagePickerManager Error: ', response.error);
	  }
	  else if (response.customButton) {
	    ////console.log('User tapped custom button: ', response.customButton);
      this.props.onCustomButtonSelect(response.customButton);
	  }
	  else {
      // You can display the image using either data:
	    // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

	    // // uri (on iOS)
	    // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
	    // // uri (on android)
      if(this.props.data === true) {
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        if(source != this.state.picture) {
          this.setState({
    	      picture: source
    	    });
          this.props.onChange(this.state.picture);
        }
      }else {
        const source = {uri: response.uri, isStatic: true};
        if(source != this.state.picture) {
          this.setState({
    	      picture: source
    	    });
          this.props.onChange(this.state.picture);
        }
      }
	  }
  }
};

ImagePicker.defaultProps = {
                              viewOnly: false,
                              data: false,
                              onChange: function(picture) {
                              
                              }.bind(this),
                              defaultPicture: require('image!icons_merchant_photo'),
                              cancelButtonTitle: 'Cancel',
                              cameraType: 'back', // 'front' or 'back'
                              mediaType: 'photo', // 'photo' or 'video'
                              videoQuality: 'high', // 'low', 'medium', or 'high'
                              durationLimit: 20, // video recording max time in seconds
                              maxWidth: 500, // photos only
                              maxHeight: 500, // photos only
                              aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
                              aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
                              quality: 1, // 0 to 1, photos only
                              angle: 0, // android only, photos only
                              allowsEditing: true, // Built in functionality to resize/reposition the image after selection
                              noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
                              storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
                                skipBackup: true, // ios only - image will NOT be backed up to icloud
                                path: 'images' // ios only - will save image at /Documents/images rather than the root
                              }
                            };

module.exports = ImagePicker;

var styles = StyleSheet.create({
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
    height:200,
    width: 200
  }
});
