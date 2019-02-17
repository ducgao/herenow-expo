import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  Image, 
  View, 
  ScrollView,
  TouchableOpacity,
  Text,
  BackHandler,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { theme } from '../res/theme'
import string from '../res/string'
import UserRepository from '../repository/user-repository'

const attributes = [
  {
    index: 0,
    name: 'Edit profile'
  },
  {
    index: 1,
    name: 'Saved'
  },
  {
    index: 2,
    name: 'Privacy'
  },
  {
    index: 3,
    name: 'Contact us'
  },
  {
    index: 4,
    name: 'About us'
  },
]

export default class UserInfo extends Component {
  static navigationOptions = { header: null }

  userRepository = UserRepository.instance()

  state = {
    userData: null
  }

  componentWillMount() {
    this.setState({ userData: this.userRepository.getUserData() })
  }

  _openSetting = () => {
    const title = this.userRepository.getDarkModeEnable() ? string.change_light_mode_confirm_title : string.change_dark_mode_confirm_title
    const message = this.userRepository.getDarkModeEnable() ? string.change_light_mode_confirm_message : string.change_dark_mode_confirm_message

    Alert.alert(
      title, 
      message,
      [
        {
          text: string.yes, 
          onPress: () => {
            this.userRepository.setDarkModeEnable(this.userRepository.getDarkModeEnable() ? false :  true)
            BackHandler.exitApp()
          }
        },
        {
          text: string.cancel, 
          style: 'cancel'
        }
      ],
      { cancelable: false }  
    )
  }

  _logout = () => {
    Alert.alert(
      string.logout_confirm_title, 
      string.logout_confirm_message,
      [
        {
          text: string.yes, 
          onPress: () => {
            this.userRepository.logout()
            this.props.refresh()
          }
        },
        {
          text: string.cancel, 
          style: 'cancel'
        }
      ],
      { cancelable: false }  
    )
  }

  _renderHeader() {
    const userData = this.state.userData
    const displayName = userData.firstName + " " + userData.lastName
    const imageSource = userData.avatarUrl ? {uri: userData.avatarUrl} : require('../res/images/user_placeholder.jpg')
    return (
      <View style={{
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH / 1.5,
        backgroundColor: 'white'
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          position: 'absolute', 
          bottom: 8,
          marginLeft: 16
        }}>{displayName}</Text>
        <View style={{
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          position: 'absolute',
          bottom: 40,
          left: 24
        }}>
          <Image style={{
            width: 60,
            height: 60,
            borderRadius: 30
          }} source={imageSource}/>
        </View>
      </View>
    )
  }

  _requestUpdateUserInfo = () => {
    this.setState({ userData: this.userRepository.getUserData() })
  }

  _onAttributeClick = (attribute) => {
    switch (attribute.index) {
      case 0: {
        this.props.navigation.navigate('EditProfile', { requestUpdateUserInfo: this._requestUpdateUserInfo })
        break
      }
      case 1: {
        this.props.navigation.navigate('Favorite')
        break
      }
      case 2: break
      case 3: break
      case 4: break
      default: break
    }
  }

  _renderAttributes = () => {
    const items = attributes.map((attribute) =>
      [
        <TouchableOpacity 
          onPress={() => this._onAttributeClick(attribute)}
          activeOpacity={0.7} 
          key={attribute.name} 
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 50,
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: 'center'
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{
              color: theme().inactive_color
            }}>{attribute.name}</Text>
            <Icon name='chevron-right' color={theme().inactive_color} style={{ 
              position: 'absolute',
              right: 0,
              alignSelf: 'center'
            }} />
          </View>
        </TouchableOpacity>,
        <View
          key={attribute.name + 'separator'}
          style={{
            width: '100%',
            height: 1,
            backgroundColor: theme().app_background
          }}
        />
      ]
    )

    return <View style={{ marginTop: 20 }}>{items}</View>
  }

  _renderSetting() {
    const content = this.userRepository.getDarkModeEnable() ? string.change_to_light_mode : string.change_to_dark_mode
    const item = <TouchableOpacity 
    key={'logout'} 
    activeOpacity={0.7} 
    onPress={this._openSetting}
    style={{
      backgroundColor: 'white',
      width: '100%',
      height: 50,
      paddingLeft: 16,
      paddingRight: 16,
      justifyContent: 'center'
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{
          color: theme().inactive_color
        }}>{content}</Text>
      </View>
    </TouchableOpacity>

    return <View style={{ marginTop: 20 }}>{item}</View>
  }

  _renderLogout() {
    const item = <TouchableOpacity 
    key={'logout'} 
    activeOpacity={0.7} 
    onPress={this._logout}
    style={{
      backgroundColor: 'white',
      width: '100%',
      height: 50,
      paddingLeft: 16,
      paddingRight: 16,
      justifyContent: 'center'
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{
          color: theme().inactive_color
        }}>{string.logout}</Text>
      </View>
    </TouchableOpacity>

    return <View style={{ marginTop: 20 }}>{item}</View>
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }} >
          <View>
            {this._renderHeader()}
            {this._renderAttributes()}
            {this._renderSetting()}
            {this._renderLogout()}
          </View>  
        </ScrollView>
      </View>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
})
