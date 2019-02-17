import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { theme } from '../res/theme'
import UserRepository from '../repository/user-repository'
import Api from '../api'

const WINDOW_WIDTH = Dimensions.get('window').width
export default class Post extends Component {

  _userRepository = UserRepository.instance()
  _api = Api.instance()

  _onPress = () => {
    this.props.onPress(this.props.data)
  }

  _addToWishList = () => {
    if (this._userRepository.isLogged()) {
      this._api.savePost(this.props.data.id).then(res => {
        if (res.code) {
          Alert.alert("Herenow", "Can not save post, please try again later!")
        } else {
          Alert.alert("Herenow", "Post successfully saved!")
        }
      })
      .catch(e => {
        alert(e)
      })
    }
    else {
      Alert.alert("Herenow", "Please sign in to save posts")
    }
  }

  _renderFavoriteButton() {
    if (this.props.enableSaveButton == true) {
      return <TouchableOpacity style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 50,
        height: 50
      }} onPress={this._addToWishList}>
        <Image
          style={{
              tintColor: 'gray',
              width: 50,
              height: 50
          }}
          source={require('../res/images/sign.png')}
        />
      </TouchableOpacity>
    }
  }

  render() {
    const data = this.props.data
    const imageSource = data.coverUrl ? {uri: data.coverUrl} : null
    const date = moment(new Date(data.createdAt), 'DD/MM/YYYY').format('DD/MM/YYYY')
    return (
      <TouchableOpacity 
        style={[
          this.props.style, 
          { 
            width: WINDOW_WIDTH - 16 * 2,
            backgroundColor: 'white',
            borderRadius: 8,
            marginTop: 12,
            marginLeft: 16,
            marginRight: 16
          }]} 
        activeOpacity={0.7} 
        onPress={this._onPress} >
        {this._renderFavoriteButton()}
        <Text style={{ 
          marginTop: 12, 
          marginLeft: 12,
          marginRight: 56,
          fontSize: 16,
          fontWeight: 'bold'
          }}>{data.title}</Text>
        <Text style={{
          marginLeft: 12,
          marginRight: 40,
          fontSize: 14,
        }} numberOfLines={2}>{data.content}</Text>
        <Image style={{
          height: 160,
          width: '100%',
          marginTop: 12,
          backgroundColor: theme().image_background,
        }} source={imageSource} />
        <View style={{ 
          flexDirection: 'row', 
          marginTop: 8, 
          marginBottom: 8, 
          marginLeft: 12, 
          marginRight: 12
        }}>
          <Icon style={{ marginTop: 2 }} name="comment-alt" size={14}/>
          <Text style={{
            fontSize: 12,
            marginLeft: 4
          }}>{data.commentCount.count}</Text>
          <Text style={{
            position: 'absolute',
            right: 0,
            fontSize: 12,
            marginLeft: 4
          }}>{date}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}