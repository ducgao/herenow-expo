import React, {Component} from 'react'
import {
  StyleSheet, 
  Text, 
  View,
  Dimensions
} from 'react-native'
import FlowLayout from '../component/flowlayout'
import string from '../res/string'
import { theme } from '../res/theme'
import HNButton from '../component/hnButton'
import DataRepository from '../repository/data-repository'

export default class Favorite extends Component {
  static navigationOptions = { header: null }

  dataRepository = DataRepository.instance()
  locationComponent = null

  componentDidMount() {
    const selectedLocation = this.props.navigation.getParam("location")
    if (this.locationComponent && selectedLocation) {
      this.locationComponent.setSelected(selectedLocation.city)
    }
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _applyFilter = () => {
    const index = this.locationComponent.getSelectedPosition()
    const selectedLocation = this.dataRepository.getLocations()[index]
    const onFeedback = this.props.navigation.getParam("onLocationChanged")
    if (onFeedback) {
      onFeedback(selectedLocation)
    }
    this.props.navigation.goBack()
  }

  _renderCTA() {
    const buttonWidth = (WINDOW_WIDTH - 16 * 2) / 2 - 8
    const reset = <HNButton 
      key='filter-reset-button' 
      style={{ width: buttonWidth, marginRight: 16, backgroundColor: 'white' }} 
      textColor='black' 
      text={string.cancel}
      onPress={this._onBack} />
    const apply = <HNButton 
      key='filter-appy-button' 
      style={{ width: buttonWidth }} 
      text={string.apply} 
      onPress={this._applyFilter} />

    return (
      <View style={{ 
        flexDirection: 'row', 
        paddingLeft: 16, 
        paddingRight: 16,
        position: 'absolute',
        bottom: 16
      }} > 
        {[reset, apply]}
      </View>
    )
  }

  render() {
    const locationData = this.dataRepository.getLocations().map((l) => 
      l.city
    )
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <Text style={{
          marginTop: 80,
          marginLeft: 16,
          fontSize: 20,
          color: theme().text_color,
          fontWeight: 'bold'
        }}>{string.locations}</Text>
        <FlowLayout
          ref={ref => this.locationComponent = ref}
          style={{
            paddingLeft: 16,
            paddingRight: 16
          }}
          multiselect={false}
          dataValue={locationData}
        />
        {this._renderCTA()}
      </View>
    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
