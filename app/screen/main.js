import React, {Component} from 'react'
import {
  Dimensions,
  View,
  Image,
  Text,  
  BackHandler
} from 'react-native'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { theme } from '../res/theme'
import Megaphone from './megaphone'
import Deal from './deal'
import Home from './home'
import Wallet from './wallet'
import Profile from './profile'
import { DialogCombine, SHOW_LOADING } from '../component/dialogCombine'
import { isIphoneX } from '../utils'
import Api from '../api'
import DataRepository from '../repository/data-repository'
import UserRepository from '../repository/user-repository';

export default class Main extends Component {
  static navigationOptions = { header: null }

  api = Api.instance()
  dataRepository = DataRepository.instance()
  userRepository = UserRepository.instance()

  icons = [
    'home',
    'megaphone',
    'map-marker-alt',
    'wallet',
    'user-alt'
  ]

  titles = [
    'Home',
    'Community',
    'Map View',
    'Wallet',
    'Profile'
  ]

  homeRef = null
  megaphoneRef = null
  dealRef = null
  walletRef = null
  profileRef = null

  state = {
    index: 0,
    routes: [
      { index: 0, key: 'home', title: 'Home' },
      { index: 1, key: 'megaphone', title: 'Megaphone' },
      { index: 2, key: 'deal', title: 'Deal' },
      { index: 3, key: 'wallet', title: 'Wallet' },
      { index: 4, key: 'profile', title: 'Profile' }
    ],
    showTag: null
  }

  constructor(props) {
    super(props)

    const globalProps = {
      showLoading: this.showLoading,
      hideLoading: this.hideLoading
    }

    this.homeInstance = () => <Home ref={ref => this.homeRef = ref} {...globalProps} navigation={this.props.navigation} />
    this.megaphoneInstance = () => <Megaphone ref={ref => this.megaphoneRef = ref} {...globalProps} navigation={this.props.navigation} />
    this.dealInstance = () => <Deal ref={ref => this.dealRef = ref} {...globalProps} navigation={this.props.navigation} />
    this.walletInstance = () => <Wallet ref={ref => this.walletRef = ref} {...globalProps} navigation={this.props.navigation} />
    this.profileInstance = () => <Profile ref={ref => this.profileRef = ref} {...globalProps} navigation={this.props.navigation} />
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    this._updateDataHome()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  _handleBackPress = () => {
    const currentRoute = this.dataRepository.getCurrentRoute()

    if (this.state.index == 0) {
      return false
    }

    if (currentRoute.index > 0) {
      return false
    }

    this.setState({ index: 0 })
    return true
  }

  showLoading = () => {
    this.setState({ showTag: SHOW_LOADING })
  }

  hideLoading = () => {
    this.setState({ showTag: null })
  }

  _updateDataHome = () => {
    // this.homeRef.onDataUpdating()
    // this.api.getLocations().then(locations => {
    //   this.dataRepository.setLocations(locations.data)
    //   this.homeRef.onDataReady()
    // })
  }

  _updateDataMegaphone = () => {
    this.megaphoneRef.onScreenWillDisplayed()
  }

  _updateDataDeal = () => {
    this.dealRef.loadData()
  }

  _updateDataWallet = () => {
    if (this.userRepository.isLogged()) {
      this.walletRef.onDataUpdating()
      this.api.getWallet().then(wallet => {
        alert(JSON.stringify(wallet))
        if (Array.isArray(wallet.deals)) {
          this.dataRepository.setWallet(wallet.deals)
        }
        else {
          this.dataRepository.setWallet([])
        }
        
        this.walletRef.onDataReady()
      })
    }
    else {
      this.walletRef.onDataReady()
    }
  }
  _updateDataProfile = () => {}

  _onTabIndexChanged = (index) => {
    this.setState({ index })
    switch (index) {
      case 0: { 
        this._updateDataHome()
        break 
      }
      case 1: {
        this._updateDataMegaphone() 
        break 
      }
      case 2: { 
        this._updateDataDeal() 
        break 
      }
      case 3: { 
        this._updateDataWallet() 
        break 
      }
      case 4: { 
        this._updateDataProfile() 
        break 
      }
    }
  }

  _renderLabel = (props) => {
    const route = props.route
    const iconColor = this.state.index == route.index ? theme().button_active : theme().primary_color
    const iconName = this.icons[route.index] 
    const iconTitle = this.titles[route.index] 

    if (iconName == 'home') {
      return this._renderTabIcon(iconTitle, require('../res/images/ic_home.png'), iconColor)
    }
    else if (iconName == 'megaphone') {
      return this._renderTabIcon(iconTitle, require('../res/images/ic_community.png'), iconColor)
    }
    else if (iconName == 'map-marker-alt') {
      return this._renderTabIcon(iconTitle, require('../res/images/ic_map.png'), iconColor)
    }
    else if (iconName == 'wallet') {
      return this._renderTabIcon(iconTitle, require('../res/images/ic_wallet.png'), iconColor)
    }
    else if (iconName == 'user-alt') {
      return this._renderTabIcon(iconTitle, require('../res/images/ic_profile.png'), iconColor)
    }
  }

  _renderTabIcon(title, imageSource, iconColor) {
    return <View style={{ height: 44, justifyContent: 'center'}}>
      <Image
        resizeMode='contain'
        style={{width: 22, height: 22, tintColor: iconColor, alignSelf: 'center'}}
        source={imageSource}
      />
      <Text numberOfLines={1} style={{ fontSize: 9, color: iconColor, alignSelf: 'center', marginTop: 4 }}>{title}</Text>
    </View>
  }

  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      style={{ backgroundColor: null, height: 56, marginBottom: isIphoneX() ? 8 : 0 }}
      indicatorStyle={{ backgroundColor: null }}
      renderLabel={this._renderLabel}
    />
  }

  render() {
    const tabView = <TabView
      key={'tabview-main'}
      style={{ backgroundColor: theme().secondary_color }}
      navigationState={this.state}
      onIndexChange={this._onTabIndexChanged}
      initialLayout={{ 
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
        }}
      tabBarPosition={'bottom'}
      renderTabBar={this._renderTabBar}
      renderScene={SceneMap({
        home: this.homeInstance,
        megaphone: this.megaphoneInstance,
        deal: this.dealInstance,
        wallet: this.walletInstance,
        profile: this.profileInstance
      })}
    />
    const dialogCombine = <DialogCombine key={'dialogcombine-main'} showTag={this.state.showTag} />
    return [tabView, dialogCombine]
  }
}
