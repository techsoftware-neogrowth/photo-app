const React = require('react-native');
import {getNetworkOnlineAction, getNetworkOfflineAction, getDataFlushSuccess} from './../actions/appActions'
import {getAddLeadAction, getUpdateLeadAction2} from './../actions/leadlists'
import TimerMixin from 'react-timer-mixin';
import {SYNC_FREQ} from './../constants/AppConstants'
import {DB_PROVIDER} from './../constants/Config'

import {arrayOf, normalize, Schema} from 'normalizr'


let {
  StyleSheet,
  Navigator,
  PropTypes,
  NetInfo
} = React

import MainContainer from './MainContainer'

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this._handleConnectionInfoChange = this._handleConnectionInfoChange.bind(this);
  }

  componentDidMount() {
    NetInfo.addEventListener(
        'change',
        this._handleConnectionInfoChange
    );
    NetInfo.fetch().done(
        (connectionInfo) => { this._handleConnectionInfoChange({connectionInfo}) }
    );

    this.syncHandle = TimerMixin.setInterval.call(this, this.syncData, SYNC_FREQ);
    // this.syncHandle = this.setInterval(this.syncData.bind(this), SYNC_FREQ);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
        'change',
        this._handleConnectionInfoChange
    );
    TimerMixin.componentWillUnmount.call(this);
    // this.clearInterval(this.syncHandle);
  }

  syncData() {
      const {store} = this.props;
      DB_PROVIDER.flushOut().then(function(data) {
        let flushed = data.flushed;
        let addedLead = data.addedLead;
        let updateLead = data.updateLead;

        if(flushed) {
          let leadSchema = new Schema('myLeads' , { idAttribute: '_id' });
          const normalized = normalize(flushed, leadSchema);

          store.dispatch(getDataFlushSuccess(normalized.entities, normalized.result, 'myLeads'));
        }
        if(addedLead) {
          let leadAddSchema = new Schema('myLeads' , { idAttribute: 'id' });
          const normalized_add = normalize(addedLead, leadAddSchema);

          store.dispatch(getAddLeadAction(normalized_add.entities, normalized_add.result, 'myLeads'));
        }

        if(updateLead) {
          let leadSchema = new Schema('myLeads' , { idAttribute: '_id' });
          const normalized = normalize(updateLead, leadSchema);
        
          store.dispatch(getUpdateLeadAction2(normalized.entities, normalized.result, 'myLeads'));
        }

      });
  }

  _handleConnectionInfoChange(connectionInfo) {
    const {store} = this.props
    switch(connectionInfo) {
      case 'NONE':
        store.dispatch(getNetworkOfflineAction());
        break;

      default :
        store.dispatch(getNetworkOnlineAction());
        break;
    }
  }


  renderScene(route, navigator) {
    let Component = route.component

    return (
      <Component navigator={navigator} route={route} />
    )
  }

  configureScene(route) {
    if (route.name && route.name === 'Search') {
      return Navigator.SceneConfigs.FadeAndroid
    } else {
      return Navigator.SceneConfigs.FloatFromBottomAndroid
    }
  }

  render() {
    return (
      <Navigator
        ref='navigator'
        style={styles.navigator}
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        initialRoute={{
          component: MainContainer,
          name: 'Main'
        }}
      />
    )
  }
}

let styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
})

export default App
