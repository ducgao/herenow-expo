import React, {Component} from 'react'
import {
  StyleSheet, 
  Image, 
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/FontAwesome'
import { theme } from '../res/theme'

export default class PhotoGallery extends Component {
  static navigationOptions = { header: null }

  startIndex = 0

  state = {
    images: [],
    index: 0
  }

  componentWillMount() {
    this.startIndex = this.props.navigation.getParam("index")
    this.setState({
      images: this.props.navigation.getParam("images")
    })
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _renderItem ({item, index}) {
    return (
      <View key={index}>
        <Image style={{ width: itemWidth, height: WINDOWN_HEIGHT}} source={{ uri: item.url }} resizeMode='contain' />
      </View>
    )
  }

  _renderCloseButton() {
    return (
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 54,
        right: 16,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
      }} onPress={this._onBack} activeOpacity={0.7} key={"deal-detail-close"}>
        <Icon style={{
          justifyContent: 'center', 
          alignItems: 'center',  
          alignContent: 'center',
          alignSelf: 'center',
          textAlign: 'center'
        }} name='close' size={20} color={theme().inactive_color} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel 
          data={this.state.images}
          layout={'default'}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          firstItem={this.startIndex}
        />
        {this._renderCloseButton()}
      </View>
    )
  }
}

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const { width: viewportWidth } = Dimensions.get('window')
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

const sliderWidth = viewportWidth
const itemWidth = slideWidth + itemHorizontalMargin * 2

const WINDOWN_HEIGHT = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  }
})
