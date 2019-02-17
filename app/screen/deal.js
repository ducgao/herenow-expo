/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { theme } from '../res/theme'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Carousel from 'react-native-snap-carousel'
import { LinearGradient } from 'expo'
import DataRepository from '../repository/data-repository'
import UserRepository from '../repository/user-repository'
import Api from '../api'
import { isIphoneX } from '../utils'
import string from '../res/string'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SearchView from '../component/searchView'
import DealCarousel from '../component/deal-carousel'

const BASE_LATITUDE_DELTA = 0.01
const BASE_LONGITUDE_DELTA = 0.01

export default class Deal extends Component {
  static navigationOptions = { header: null }

  updatingOffset = new Animated.Value(-40)

  dataRepository = DataRepository.instance()
  userRepository = UserRepository.instance()
  api = Api.instance()

  markers = []
  markerRefs = []
  carousel = null

  state = {
    deals: [],
    status: string.updating,
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: BASE_LATITUDE_DELTA,
      longitudeDelta: BASE_LONGITUDE_DELTA
    }
  }

  loadData() {
    Animated.timing(this.updatingOffset, { toValue: 0 }).start()
    this.setState({ status: string.updating }, () => {
      const userLocation = this.userRepository.getUserLocation()
      this.api.getNearby({ latitude: userLocation.latitude, longitude: userLocation.longitude })
      .then(data => {
        this._setData({ latitude: userLocation.latitude, longitude: userLocation.longitude }, data)
      })
    }) 
    // const oldNearby = this.dataRepository.getNearby()
    // if (oldNearby.length == 0) {
    //   const location = UserRepository.instance().getUserLocation()
    //   if (location.latitude == null || location.longitude == null) { return }
    //   this.api.getNearby(location).then(nearby => {
    //     this.dataRepository.setNearby(nearby)
    //     if (nearby.length == 0) {
    //       this._setData(location, nearby)
    //     }
    //     else {
    //       const firstDeal = nearby[0]
    //       const location = { latitude: firstDeal.latitude, longitude: firstDeal.longitude }
    //       this._setData(location, nearby)
    //     }
    //   })
    // }
    // else {
    //   const firstDeal = oldNearby[0]
    //   const location = { latitude: firstDeal.latitude, longitude: firstDeal.longitude }
    //   this._setData(location, oldNearby)
    // }
  }

  _setData = (location, deals) => {
    if (deals.length == 0) {
      this.setState({ status: string.no_deal_nearby })
      navigator.geolocation.getCurrentPosition((location) => {
        const latitude = location.coords.latitude
        const longitude = location.coords.longitude
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: BASE_LATITUDE_DELTA,
            longitudeDelta: BASE_LONGITUDE_DELTA
          },
          deals
        })
      })
      return
    }
    
    Animated.timing(this.updatingOffset, { toValue: -40 }).start()
    this.markers = deals.map(deal => {
      return <Marker
        ref={ref => { if (ref != null) this.markerRefs.push(ref) }}
        key={deal.id}
        title={deal.name}
        description={deal.shortDesc}
        coordinate={{latitude: deal.latitude, longitude: deal.longitude}}
      />
    })

    this.setState({ 
      region: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: BASE_LATITUDE_DELTA,
        longitudeDelta: BASE_LONGITUDE_DELTA
      },
      deals
    })  
  }

  _onFilterClick = () => {
    this.props.navigation.navigate("Filter")
  }

  _onDealSelected = (index) => {
    const selectedDeal = this.state.deals[index]
    this.markerRefs[index].showCallout()
    this.setState({
      region: {
        latitude: selectedDeal.latitude,
        longitude: selectedDeal.longitude,
        latitudeDelta: BASE_LATITUDE_DELTA,
        longitudeDelta: BASE_LONGITUDE_DELTA
      }
    })
  }

  _onMarkerPress = (e) => {
    location = e.nativeEvent.coordinate
    const selectedDealIndex = this.state.deals.findIndex(d => {
      return d.latitude == location.latitude && d.longitude == location.longitude
    })

    this.carousel.snapToItem(selectedDealIndex, true)
  }

  _onOpenDeal = (deal) => {
    this.props.navigation.navigate("DealDetail", { deal: {deal} })
  }
  
  /*
   * Currently I will disable search view, will enable and implement it's function later
   */
  _renderSearchView() {
    return <View style={styles.searchView} >
      <SearchView 
        style={{ position: 'absolute', width: WINDOW_WIDTH - 16 * 2 }} 
        onFilterClick={this._onFilterClick}
      />
      <TouchableOpacity style={{ 
        width: WINDOW_WIDTH - 16 * 2,
        height: 40,
        backgroundColor: 'transparent', 
        position: 'absolute' }} 
        onPress={() => this.props.navigation.navigate('Search')}
        />
    </View>
  }

  _renderDealList() {
    if (this.state.deals.length == 0) {
      return
    }

    return (
      <LinearGradient style={{
        width: WINDOW_WIDTH,
        height: 170,
        position: 'absolute',
        bottom: 0
      }} colors={['#FFFFFF00', '#FFF']}>
          <Carousel 
            ref={ref => this.carousel = ref}
            data={this.state.deals}
            layout={'default'}
            loop={true}
            onSnapToItem={this._onDealSelected}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={this.startIndex}
          />
      </LinearGradient>
    )
  }

  _renderItem = ({item, index}) => {
    return <DealCarousel key={index} data={item} onPress={this._onOpenDeal}/>
  }

  _renderUpdatingIndicator() {
    const icon = this.state.status == string.updating ? 
      <ActivityIndicator style={{ marginLeft: 16 }} /> 
      :
      <Icon name="frown" color="white" size={16} style={{ marginLeft: 16 }} /> 
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
      {icon}
      <Text style={{ color: 'white', marginLeft: 8 }}>{this.state.status}</Text>
    </Animated.View>
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]} >
        <MapView
          style={{flex: 1}}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          onMarkerPress={this._onMarkerPress}
        >
          {this.markers}
        </MapView>
        {this._renderSearchView()}
        {this._renderDealList()}
        {this._renderUpdatingIndicator()}
      </View>
    )
  }
}

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const { width: viewportWidth } = Dimensions.get('window')

const sliderWidth = viewportWidth
const itemWidth = viewportWidth / 2

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchView: {
    width: WINDOW_WIDTH - 16 * 2,
    position: 'absolute',
    top: 40 + (isIphoneX() ? 12 : 0),
    left: 16, 
  }
});
