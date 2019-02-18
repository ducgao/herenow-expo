import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  Image, 
  BackHandler,
  View, 
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Text
} from 'react-native'
import { LinearGradient } from 'expo'
import DealList from '../component/deal-list'
import HomeProvider from '../component/home-provider'
import string from '../res/string'
import DataRepository from '../repository/data-repository'
import { theme } from '../res/theme'
import UserRepository from '../repository/user-repository'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Api from '../api'
import { isIphoneX } from '../utils';

export default class Home extends Component {
  static navigationOptions = { header: null }

  dataRepository = DataRepository.instance()
  userRepository = UserRepository.instance()
  api = Api.instance()

  updatingOffset = new Animated.Value(-40)

  currentDealPage = 0

  state = {
    dealsPagingInfo: null,
    deals: null,
    dealFilter: null,
    featuredProviders: null,
    userLocation: null
  }

  componentWillMount() {
    this.props.showLoading()
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude
      const longitude = location.coords.longitude
      this.api.getLocations().then(locations => {
        this.dataRepository.setLocations(locations.data)
        this._onDataReady(latitude, longitude)
      })
    })
  }

  onDataUpdating = () => {
    // setTimeout(() => {
    //   Animated.timing(this.updatingOffset, { toValue: 0 }).start()
    // }, 500)
  }

  _onDataReady = (latitude, longitude) => {
    this.api.getNearLocation({ latitude, longitude }).then(data => {
      const newLocation = data[0]
      this.api.setCurrentLocation(newLocation)
      this.userRepository.setUserLocation(newLocation)
      this.setState({
        userLocation: newLocation
      }, () => { 
        this.api.getCategories().then(categories => {
          this.dataRepository.setCategories(categories.data)
          
          Animated.timing(this.updatingOffset, { toValue: -40 }).start() 
          this.props.hideLoading()
          this._updateFeaturedProviders()   
          this._updateDeals()
        })
      })
    })
  }

  _updateDealFilter = (newFilter) => {
    this.setState({
      dealFilter: newFilter,
      deals: null,
      dealsPagingInfo: null
    }, () => {
      this._updateDeals()
    })
  }

  _requestFilterDeals = () => {
    this.props.navigation.navigate('Filter', { 
      onFeedback: this._updateDealFilter,
      category: this.state.dealFilter
    })
  }

  _updateFeaturedProviders = () => {
    this.setState({ featuredProviders: null }, () => {
      this.api.getFeaturedProviders().then(data => {
        this.setState({ featuredProviders: data.data })
      })
    })
  }

  _updateDeals = (page = 0) => {
    var params = [{name: "city", value: this.state.userLocation.city}]
    if (this.state.dealFilter) {
      params = [
        {name: "city", value: this.state.userLocation.city},
        {name: "categoryId", value: this.state.dealFilter.id}
      ]
    }
    this.api.searchWith(params, page).then(data => {
      const deals = this.state.deals
      var newDeals = deals ? deals : []
      if (page == 0) {
        newDeals = []
      }

      data.data.forEach(i => newDeals.push(i))

      this.setState({ 
        dealsPagingInfo: {
          total: data.total,
          limit: data.limit,
          skip: data.skip
        },
        deals: newDeals
      })
    })
  }

  _onDealClick = (deal) => {
    this.props.navigation.navigate("DealDetail", { deal: { deal } })
  }

  _onProviderClick = (provider) => {
    this.props.navigation.navigate('ProviderDetail', { provider: provider.provider })
  }

  _onRequestChangeLocation = () => {
    this.props.navigation.navigate("Locations", { location: this.state.userLocation, onLocationChanged: this._onLocationChanged })
  }
  
  _onLocationChanged = (newLocation) => {
    this.userRepository.setUserLocation(newLocation)
    if (this.state.userLocation != newLocation) {
      this.api.setCurrentLocation(newLocation)
      this.userRepository.setUserLocation(newLocation)
      this.setState({
        userLocation: newLocation
      }, () => {
        this._updateFeaturedProviders()
        this._updateDeals()
      })
    }
  }

  _renderHeader() {
    locationCover = this.state.userLocation ? { uri: this.state.userLocation.coverUrl } : require('../res/images/location.jpg')
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this._onRequestChangeLocation}>
        <Image style={{
          width: WINDOW_WIDTH,
          height: (WINDOW_WIDTH / 2.2) + (isIphoneX ? 24 : 0)
        }} resizeMode='cover' source={locationCover} />
        <Image
          style={{
            position: 'absolute',
            width: 80,
            top: 20 + (isIphoneX ? 24 : 0),
            left: 16,
            resizeMode: 'contain'
          }}
          source={require('../res/images/logo.png')}
        />
        <LinearGradient style={{
          position: 'absolute',
          bottom: 0,
          width: WINDOW_WIDTH,
          height: 50
        }} colors={['#00000000', '#000']}>
          <Text style={{
              color: 'white',
              fontSize: 14,
              position: 'absolute', 
              left: 16,
              bottom: 36
            }}>Welcome to</Text>
          <Text style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            position: 'absolute', 
            left: 16,
            bottom: 8
          }}>{this.state.userLocation ? this.state.userLocation.city : string.fetching }</Text>
          <Text style={{
              color: 'gray',
              fontSize: 11,
              position: 'absolute', 
              right: 16,
              bottom: 12,
              textDecorationLine: 'underline'
            }}>{string.tap_to_change}</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  _renderFeaturedProviders() {
    const groups = this.state.featuredProviders ? this.state.featuredProviders.map((group) => 
      <HomeProvider
        style={{ marginLeft: 16 }} 
        key={group.id} 
        data={group}
        onPress={this._onProviderClick}
        />
    ) : null

    const content = this.state.featuredProviders == null ? 
      <ActivityIndicator style={{ marginLeft: 16, marginBottom: 120, alignSelf: 'flex-start' }} /> 
      :
      this.state.featuredProviders.length == 0 ?
        <Text style={{
          marginLeft: 16,
          fontStyle: 'italic',
          fontSize: 12,
          color: theme().text_color
        }}>{string.no_group}</Text>
        :
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingRight: 16 }} >
            {groups}
          </View>
        </ScrollView> 

    return (
      <View 
        style={{
          width: WINDOW_WIDTH,
          marginTop: 16
        }}
      >
        <Text style={{ 
          paddingLeft: 16, 
          fontSize: 14, 
          fontWeight: '400',
          marginBottom: 12, 
          color: theme().primary_color
        }} >{string.groups_we_love}</Text>
        {content}
      </View>
    )
  }

  _renderTodayDeals() {
    const content = this.state.deals == null ? 
      <ActivityIndicator style={{ marginLeft: 16, alignSelf: 'flex-start' }} /> 
      :
      this.state.deals.length == 0 ? 
        <Text style={{
          marginLeft: 16,
          fontStyle: 'italic',
          fontSize: 12,
          color: theme().text_color
        }}>{string.no_today_deals}</Text>
        :
        this.state.deals.map((deal) => 
          <DealList
            style={{ marginLeft: 16, marginRight: 16, marginBottom: 16 }}
            key={deal.id}
            data={deal}
            onPress={this._onDealClick}
          />
        )

    const loadMore = this.state.dealsPagingInfo == null ? null : this._renderLoadMore() 

    return (
      <View 
        style={{
          width: WINDOW_WIDTH,
          marginTop: 16
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ 
            paddingLeft: 16, 
            fontSize: 14, 
            marginBottom: 12, 
            fontWeight: '400',
            color: theme().primary_color
          }} >{string.today_deals}</Text>
          <Text style={{ 
            paddingLeft: 4, 
            fontSize: 11,
            marginTop: 3,
            fontStyle: 'italic',
            fontWeight: '400',
            color: theme().primary_color
          }} >{this.state.dealFilter ? (" (" + this.state.dealFilter.name + ")") : ""}</Text>
          <Icon 
            style={{ position: 'absolute', right: 16, top: 4 }} 
            name="filter" size={14} 
            color={theme().primary_color} 
            onPress={this._requestFilterDeals}
          />
        </View>
        {[content, loadMore]}
      </View>
    )
  }

  _renderLoadMore() {
    const pagingInfo = this.state.dealsPagingInfo
    const currentDisplayDealsCount = pagingInfo.skip + pagingInfo.limit

    if (currentDisplayDealsCount >= pagingInfo.total) {
      return null
    }

    return <View style={{ 
      paddingTop: 8,
      paddingBottom: 16,
      flexDirection: 'row'
     }}>
      <ActivityIndicator style={{alignSelf: 'flex-start', marginLeft: 16}} />
      <Text style={{ 
        fontStyle: 'italic', 
        marginLeft: 8,
        color: theme().text_color
      }}>{string.loading_more}</Text>
    </View>
  }

  _renderUpdatingIndicator() {
    return <Animated.View style={{
      position: 'absolute',
      width: WINDOW_WIDTH,
      height: 40,
      backgroundColor: theme().primary_color,
      bottom: this.updatingOffset,
      justifyContent: 'flex-start',
      flexDirection: 'row', 
      alignItems: 'center'
    }}>
      <ActivityIndicator style={{ marginLeft: 16 }} />
      <Text style={{ color: 'white', marginLeft: 8 }}>Updating...</Text>
    </Animated.View>
  }

  _isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0.5
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background } ]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          onScroll={({nativeEvent}) => {
            if (this._isCloseToBottom(nativeEvent)) {
              this.currentDealPage += 1
              this._updateDeals(this.currentDealPage)
            }
          }}
          scrollEventThrottle={400}
        >
          <View>
            {this._renderHeader()}
            {this._renderFeaturedProviders()}
            {this._renderTodayDeals()}
          </View>  
        </ScrollView>
        {this._renderUpdatingIndicator()}
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
