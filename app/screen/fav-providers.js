import React, {Component} from 'react'
import {
  Text,
  Dimensions
} from 'react-native'

export default class SavedProviders extends Component {
  static navigationOptions = { header: null }

  render() {
    return (
      <Text style={{
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        textAlign: 'center',
        marginTop: 100
      }}>FAV PROVIDERS</Text>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height