import React, {Component} from 'react'
import {
  StyleSheet, 
  View,
  Text,
  Dimensions
} from 'react-native'
import { isIphoneX } from '../utils'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import BuySell from './megaphone-buy-sell'
import Shoutout from './megaphone-shoutout'
import LocationContent from './megaphone-location-content'
import Api from '../api'
import UserRepository from '../repository/user-repository';
import { theme } from '../res/theme'

export default class Search extends Component {
  state = {
    index: 0,
    routes: [
      { index: 0, key: 'locationContent', title: 'Location Content' },
      { index: 1, key: 'shoutout', title: 'Shout Out' },
      { index: 2, key: 'buySell', title: 'Buy & Sell' }
    ]
  }

  api = Api.instance()

  constructor(props) {
    super(props)

    this.buySellInstance = () => <BuySell ref={ref => this.buySellRef = ref} {...this.props} />
    this.shoutoutInstance = () => <Shoutout ref={ref => this.shoutoutRef = ref} {...this.props} />
    this.locationContentInstance = () => <LocationContent ref={ref => this.locationContentRef = ref} {...this.props} />
  }

  onScreenWillDisplayed = () => {
    this.setState({ 
      routes: [
        { index: 0, key: 'locationContent', title: UserRepository.instance().getUserLocation().city },
        { index: 1, key: 'shoutout', title: 'Shout Out' },
        { index: 2, key: 'buySell', title: 'Buy & Sell' }
      ]
     })
    this._updateLocationContent()
  }

  _updateLocationContent = () => {
    this.locationContentRef.requestUpdateData()
  }

  _updateShoutout = () => {
    this.shoutoutRef.requestUpdateData()
  }

  _updateBuySell = () => {
    this.buySellRef.requestUpdateData()
  }

  _onTabIndexChanged = (index) => {
    this.setState({ index })
    switch (index) {
      case 0: { 
        this._updateLocationContent()
        break 
      }
      case 1: {
        this._updateShoutout() 
        break 
      }
      case 2: { 
        this._updateBuySell() 
        break 
      }
    }
  }

  _renderLabel = (props) => {
    const route = props.route
    const textColor = this.state.index == route.index ? 'white' : 'white'
    return (
      <View style={{
        height: 50, 
        marginTop: isIphoneX ? 24 : 0,
        justifyContent: 'center'
      }}>
        <Text style={{color: textColor, fontSize: 12, textAlign: 'center'}} >{route.title}</Text>
      </View>
    )
  }

  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      style={{ 
        backgroundColor: theme().primary_color, 
        height: 50 + (isIphoneX ? 24 : 0)
      }}
      indicatorStyle={{ backgroundColor: theme().accent_color }}
      renderLabel={this._renderLabel}
    />
  }

  render() {
    return (
      <TabView
        style={{backgroundColor: theme().app_background}}
        navigationState={this.state}
        onIndexChange={this._onTabIndexChanged}
        initialLayout={{ 
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
          }}
        renderTabBar={this._renderTabBar}
        renderScene={SceneMap({
          locationContent: this.locationContentInstance,
          shoutout: this.shoutoutInstance,
          buySell: this.buySellInstance
        })}
      />
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchView: {
    width: WINDOW_WIDTH - 16 * 2,
    position: 'absolute',
    top: 40 + (isIphoneX() ? 12 : 0)
  }
})
