import React from 'react-native'
import { Provider } from 'react-redux'
import configureStore from './store/configure-store'
let {View} = React

import App from './containers/app'

const store = configureStore()

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
     	  <App store={store}/>
      </Provider>
    )
  }
}

export default Root
