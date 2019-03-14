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

  state = {
    isLoved: false
  }

  componentDidMount() {
    const isSaved = this.props.data.isSaved
    const isLoved = isSaved != null && isSaved != undefined && isSaved.count > 0

    this.setState({
      isLoved
    })
  }

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
          this.setState({
            isLoved: true
          })
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
      }} onPress={this._addToWishList} disabled={this.state.isLoved}>
        <Image
          style={{
              tintColor: this.state.isLoved ? theme().accent_color : 'gray',
              width: 50,
              height: 50
          }}
          source={require('../res/images/sign.png')}
        />
      </TouchableOpacity>
    }
  }

  _renderCommentInfo() {
    const data = this.props.data
    if (data.commentCount) {
      return [
        <Icon style={{ marginTop: 2 }} name="comment-alt" size={14}/>,
        <Text style={{
          fontSize: 12,
          marginLeft: 4
        }}>{data.commentCount.count}</Text>
      ]
    }
  }
  _renderImagePost() {
    const data = this.props.data
    const imageSource = data.coverUrl ? {uri: data.coverUrl} : null
    if (imageSource!= null && imageSource!= "") {
      return [<Image style={{
        height: 160,
        width: '100%',
        marginTop: 12,
        backgroundColor: 'white',
      }} source={imageSource} />
      ]
    }
  }
  render() {
    const data = this.props.data

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
        }} numberOfLines={3}>{data.content}</Text>
        {this._renderImagePost()}
        <View style={{ 
          flexDirection: 'row', 
          height: 16,
          marginTop: 8, 
          marginBottom: 8, 
          marginLeft: 12, 
          marginRight: 12
        }}>
          {this._renderCommentInfo()}
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