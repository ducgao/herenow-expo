import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo'

const WINDOW_WIDTH = Dimensions.get('window').width
export default class Category extends Component {

  _onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.data)
    }
  }

  render() {
    var imageSource = null
    var backgroundColor = null

    switch (this.props.name) {
      case "Hotel": {
        imageSource = require('../res/images/ic_hotel.png')
        backgroundColor = "#ba5494"
        break
      }
      case "Food & Beverage": {
        imageSource = require('../res/images/ic_food.png')
        backgroundColor = "#ed6d34"
        break
      }
      case "Local Event": {
        imageSource = require('../res/images/ic_event.png')
        backgroundColor = "#f3b244"
        break
      }
      case "Service": {
        imageSource = require('../res/images/ic_service.png')
        backgroundColor = "#717f78"
        break
      }
      case "Shop": {
        imageSource = require('../res/images/ic_shopping.png')
        backgroundColor = "#384b62"
        break
      }
      case "Tour": {
        imageSource = require('../res/images/ic_tour.png')
        backgroundColor = "#4286f4"
        break
      }
      default: {
        imageSource = this.props.thumbnail ? {uri: this.props.thumbnail} : null
      }
    }
    
    const size = (WINDOW_WIDTH - 16 * 3) / 2
    return (
      <TouchableOpacity style={this.props.style} activeOpacity={0.7} onPress={this._onPress}>
        <View style={{
            width: size,
            justifyContent: 'center'
        }}>
          <View style={{
            height: size / 1.5,
            width: size / 1.5,
            alignSelf: 'center',
            backgroundColor: backgroundColor,
            borderRadius: size / 2,
            justifyContent: 'center'
          }}>
            <Image style={{
              height: size / 2.5,
              width: size / 2.5,
              alignSelf: 'center'
            }} source={imageSource} />
          </View>
          <Text style={{
            fontSize: 13,
            marginTop: 8,
            alignSelf: 'center'
          }}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}