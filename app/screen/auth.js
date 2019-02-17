import React, {Component} from 'react'
import {
  Text, 
  Dimensions,
  View} from 'react-native'
import SignIn from './sign-in'
import SignUp from './sign-up'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import { theme } from '../res/theme'
import UserRepository from '../repository/user-repository'
import UserInfo from './user-info'
import Api from '../api'

export default class Auth extends Component {
  static navigationOptions = { header: null }

  userRepository = UserRepository.instance()
  api = Api.instance()

  state = {
    index: 0,
    routes: [
      { index: 0, key: 'signIn', title: 'Sign In' },
      { index: 1, key: 'signUp', title: 'Sign Up' },
    ],
    isLogged: this.userRepository.isLogged()
  }

  constructor(props) {
    super(props)

    this.signInInstance = () => <SignIn {...this.props} onSignInSuccess={this._onSignInSuccess} />
    this.signUpInstance = () => <SignUp {...this.props} onSignUpSuccess={this._onSignUpSuccess}/>
  }

  componentDidMount() {
    //todo
  }

  _onSignInSuccess = (accessToken) => {
    this.userRepository.setAccessToken(accessToken)
    this.api.getUserInfo().then(res => {
      this.userRepository.setUserData(res.data[0])

      if (this.props.hideLoading) {
        this.setState({ isLogged: this.userRepository.isLogged() })
        this.props.hideLoading()
      }
      else {
        this.props.navigation.goBack()
      }
    })
  } 

  _onSignUpSuccess = () => {
    this.setState({ index: 0 })
  } 

  _renderLabel = (props) => {
    const route = props.route
    const textColor = this.state.index == route.index ? theme().primary_color : theme().inactive_color
    return (
      <View>
        <Text style={{color: textColor, fontSize: 22}} >{route.title}</Text>
      </View>
    )
  }

  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      style={{ backgroundColor: null }}
      indicatorStyle={{ backgroundColor: null }}
      renderLabel={this._renderLabel}
    />
  }

  _renderAuth() {
    return (
      <TabView
        style={{paddingTop: 60, backgroundColor: theme().app_background}}
        navigationState={this.state}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ 
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
          }}
        renderTabBar={this._renderTabBar}
        renderScene={SceneMap({
          signIn: this.signInInstance,
          signUp: this.signUpInstance,
        })}
      />
    )
  }

  _refresh = () => {
    this.setState({ isLogged: this.userRepository.isLogged() })
  }

  _renderProfile() {
    return <UserInfo {...this.props} refresh={this._refresh} />
  }

  render() {
    if (this.state.isLogged) {
      return this._renderProfile()
    }
    else {
      return this._renderAuth()
    }
  }
}
