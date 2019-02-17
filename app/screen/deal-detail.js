import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet, 
  Dimensions, 
  Image,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native'
import { theme } from '../res/theme'
import string from '../res/string'
import _ from '../utils/numberextensions'
import Api from '../api'
import { formatDateTime } from '../utils'
import Carousel from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/FontAwesome5'

export const PAYMENT_METHOD_PAYPAL = "paypal"
export const PAYMENT_METHOD_CREDIT_CARD = "credit-card"

export default class DealDetail extends Component {
  static navigationOptions = { header: null }

  api = Api.instance()

  merchant = null

  isComponentWillUnmount = true
  intervalID = null

  state = {
    deal: null,
    isDone: true,
    address: string.fetching,
    merchant: string.fetching,
    remainingTime: string.calculating,
    gallery: [],
    isLoadingImage: true
  }

  componentWillMount() {
    const deal = this.props.navigation.getParam("deal")
    this.setState({ deal })

    this.api.getAddressInfo(deal.deal.addressId).then(info => {
      const address = 
        this._displayValue(info.address1) + 
        this._displayValue(info.address2) +
        this._displayValue(info.ward) +
        this._displayValue(info.district) +
        this._displayValue(info.city) +
        this._displayValue(info.country, true)
      this.setState({ address })
    })

    this.api.getMerchant(deal.deal.providerId).then(info => {
      this.merchant = info
      this.setState({ merchant: info.name })
    })

    this.api.getGallery(deal.deal.galleryId).then(res => {
      this.setState({ gallery: Array.isArray(res.data) ? res.data : [], isLoadingImage: false })
    })

    this._initCounter(deal.deal)
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
    this.isComponentWillUnmount = true
  }

  _initCounter = (deal) => {
    const startTime = (new Date()).getTime() / 1000
    const stopTime = (new Date(deal.stopsAt)).getTime() / 1000

    this.setState({ 
      remainingTime: stopTime - startTime,
      isDone: (stopTime - startTime) < 1 ? true : false
    }, () => {
      this.isComponentWillUnmount = false
      this._countdownTask()
    })
  }

  _countdownTask = () => {
    this.intervalID = setInterval(() => {
        if (this.isComponentWillUnmount == false) {
            const newCountValue = this.state.remainingTime - 1
            if (newCountValue >= 0) {
                this.setState({ remainingTime: newCountValue })
            }
            else {
                clearInterval(this.intervalID)
                this.setState({ isDone: true })
            }
        }
    }, 1000)
  }

  _displayValue(input, isLast) {
    return input ? isLast ? input : (input + ", ") : ""
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _processWith = (method) => {
    if (method === PAYMENT_METHOD_CREDIT_CARD) {
      this.props.navigation.navigate("CartCredit", { deal: this.state.deal })  
    }
    else {
      this.props.navigation.navigate("CartPaypal")
    }
  }

  /*
   * allow credit card only 
   */
  _addCart = () => {
    // Alert.alert(
    //   this.state.deal.deal.name,
    //   string.purchase_method_message,
    //   [
    //     {text: string.process_paypal, onPress: () => this._processWith(PAYMENT_METHOD_PAYPAL)},
    //     {text: string.process_credit_card, onPress: () => this._processWith(PAYMENT_METHOD_CREDIT_CARD)},
    //     {text: string.cancel, style:'cancel'},
    //   ],
    //   { cancelable: true }
    // )
    this._processWith(PAYMENT_METHOD_CREDIT_CARD)
  }

  _openGallery = (index) => {
    var photos = []
    photos.push({url: this.state.deal.deal.coverPhotoUrl})
    if (this.state.gallery) {
      this.state.gallery.forEach(i => {
        photos.push(i)
      })
    }

    this.props.navigation.navigate('PhotoGallery', { images: photos, index })
  }

  _openMerchant = () => {
    if (this.merchant) {
      this.props.navigation.replace('ProviderDetail', { provider: this.merchant })
    }
  }
  
  _renderImageItem = ({item, index}) => {
    return (
      <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => this._openGallery(index)}>
        <Image style={{ 
          width: WINDOW_WIDTH, 
          height: WINDOW_WIDTH / 1.5,
          backgroundColor: theme().image_background
        }} source={{ uri: item.url }} resizeMode='cover' />
      </TouchableOpacity>
    )
  }
   
  _renderThumbnail() {
    var photos = []
    photos.push({url: this.state.deal.deal.coverPhotoUrl})
    if (this.state.gallery) {
      this.state.gallery.forEach(i => {
        photos.push(i)
      })
    }
    
    const loadingIndicator = <View style={{
      position: 'absolute',
      backgroundColor: 'white',
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 8,
      bottom: 8,
      right: 8,
      flexDirection: 'row',
      justifyContent: 'center'
    }}>
      <ActivityIndicator />
      <Text style={{ fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>{string.fetching}</Text>
    </View>
    
    return <View style={{ height: WINDOW_WIDTH / 1.5 }}>
      <Carousel 
        data={photos}
        layout={'default'}
        renderItem={this._renderImageItem}
        sliderWidth={sliderWidth}
        itemWidth={WINDOW_WIDTH}
      />
      {this.state.isLoadingImage ? loadingIndicator : null}
    </View>
  }

  _renderFavoriteIcon() {
    return <Icon style={{
      position: 'absolute',
      top: WINDOW_WIDTH / 1.5 - 10,
      right: 16,
      borderRadius: 8,
      width: 32, height: 44,
      paddingTop: 12,
      paddingLeft: 6,
      backgroundColor: 'white'
    }}
    name={'tag'}
    size={20}
    color={theme().inactive_color}
    />
  }

  _renderBasicInfo() {
    const deal = this.state.deal.deal
    if (deal) {
      const firstPrice = Number.parseInt(deal.price / 1000)
      const secondPrice = '.' + Number.parseInt(deal.price % 1000)

      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{
            width: '60%'
          }}>
            <Text style={{ 
                marginLeft: 16, 
                marginRight: 16,
                marginTop: 8,
                color: theme().primary_color,
                fontSize: 24 
              }} >{deal.name}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={this._openMerchant}>
              <Text style={{ 
                marginLeft: 16, 
                marginRight: 16, 
                color: 'gray',
                marginBottom: 16, 
                fontSize: 14 
              }} >{'By: ' + this.state.merchant}</Text>
            </TouchableOpacity>
          </View> 
          <View style={{ width: '36%', marginTop: 12 }}>
            <Text style={{ color: 'gray' }}>{string.price_title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ 
                color: theme().primary_color,
                fontWeight: 'bold',
                fontSize: 48
               }}>{firstPrice}</Text>
               <Text style={{ 
                color: theme().primary_color,
                fontWeight: 'bold',
                paddingTop: 12,
                fontSize: 20
              }}>{secondPrice}</Text>
            </View>
            {this._renderDiscountBlock(deal)}
          </View>
        </View>
      )
    }
  }

  _renderDiscountBlock(deal) {

    if (deal.discountAmount == null || deal.listPrice == null) {
      return
    }

    const discount = deal.discountAmount + '%'
    const original = Number.parseInt(deal.listPrice / 1000) + "K"

    const separator = <View style={{ height: 1, backgroundColor: theme().separator_color }} />
    const content = <View style={{ flexDirection: 'row' }}>
      <View>
        <Text style={{
          padding: 8,
          paddingBottom: 0,
          fontSize: 20,
          color: 'gray',
          textAlign: 'center'
        }}>{discount}</Text>
        <Text style={{
          fontSize: 14,
          color: 'gray',
          textAlign: 'center'
        }}>off</Text>
        </View>
      <View style={{ width: 1, backgroundColor: theme().separator_color, marginTop: 8, marginBottom: 8 }} />
      <View>
        <Text style={{
          padding: 8,
          marginLeft: 8,
          paddingBottom: 0,
          fontSize: 20,
          color: 'gray',
          textAlign: 'center'
        }}>{original}</Text>
        <Text style={{
          marginLeft: 8,
          fontSize: 14,
          color: 'gray',
          textAlign: 'center'
        }}>original</Text>
        </View>
    </View>

    return [separator, content]
  }

  _renderOrderStatus() {
    const separator = <View style={{ 
      height: 1, 
      width: WINDOW_WIDTH - 16 * 2, 
      backgroundColor: theme().separator_color,
      marginTop: 8,
      marginLeft: 16
     }} />

    const countDown = <View>
      <Text style={{
        color: theme().primary_color,
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center'
      }}>{this.state.isDone ? string.ended : formatDateTime(this.state.remainingTime)}</Text>
      <Text style={{
        color: theme().primary_color,
        fontSize: 18,
        textAlign: 'center'
      }}>{string.remaining}</Text>
    </View>

    const stock = <View>
      <Text style={{
        color: theme().primary_color,
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center'
      }}>{this.state.deal.deal.stock}</Text>
      <Text style={{
        color: theme().primary_color,
        fontSize: 18,
        textAlign: 'center'
      }}>{string.stock_left}</Text>
    </View>

    const divider = <View style={{ 
      width: 1, 
      backgroundColor: theme().separator_color, 
      marginLeft: 32, 
      marginRight: 32,
      marginTop: 8, 
      marginBottom: 8 
    }} />

    const content = <View style={{ flexDirection: 'row', width: WINDOW_WIDTH - 16 * 2, alignSelf: 'flex-start', marginLeft: 32 }}>
      {[countDown, divider]}
      <View style={{ position: 'absolute', right: 32 * 2 }}>
        {stock}
      </View>
    </View>

    return [separator, content, separator]
  }

  _renderAttributes() {
    const deal = this.state.deal.deal
    if (deal) {
      const attributes = [
        {
          name: string.remaining,
          value: this.state.isDone ? string.ended : formatDateTime(this.state.remainingTime),
          valueColor: 'red',
          fontWeight: 'bold'
        },
        {
          name: string.price,
          value: "¢ " + parseInt(deal.price).formatMoney()
        },
        {
          name: string.stock,
          value: deal.stock + string.stock_left
        },
        {
          name: string.merchant,
          value: this.state.merchant,
          valueColor: theme().link_color,
          onPress: this._openMerchant
        },
        {
          name: string.address,
          value: this.state.address
        }
      ]
      const content = attributes.map((attribute) => 
        <View key={attribute.name} style={{ 
          flexDirection: 'row',
          marginLeft: 16,
          marginTop: 8
        }}>
          <Text style={{ width: 100, height: 20, fontWeight: 'bold', fontSize: 12 }} >{attribute.name}</Text>
          <TouchableOpacity onPress={attribute.onPress}>
            <Text style={{ 
              width: WINDOW_WIDTH - 100 - 16 * 2, 
              fontSize: 12, 
              color: attribute.valueColor ? attribute.valueColor : null,
              fontWeight: attribute.fontWeight ? attribute.fontWeight : null  
            }}>{attribute.value}</Text>
          </TouchableOpacity>
        </View>
      )

      return content
    }
  }

  _renderDescription() {
    const deal = this.state.deal.deal
    if (deal.longDesc) {
      const title = <Text key='deal-detail-description-title' style={{ 
        color: theme().primary_color, 
        marginTop: 16,
        marginLeft: 16, 
        marginRight: 16, 
        fontSize: 20 
      }}>{string.overview}</Text>
      const content = <Text key='deal-detail-description-content' style={{ 
        color: theme().inactive_color, 
        marginTop: 8,
        marginLeft: 16, 
        marginRight: 16, 
        fontSize: 14,
        lineHeight: 20
      }}>{deal.longDesc}</Text>
      return [title, content]
    }
  }

  _renderCTA() {
    const close = <TouchableOpacity style={{
      position: 'absolute',
      bottom: 0,
      backgroundColor: theme().book_button_bg,
      width: WINDOW_WIDTH,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center'
    }} onPress={this._addCart} activeOpacity={0.7} key={"deal-detail-close"}>
      <Text style={{ color: 'white', fontSize: 24 }}>{string.book_now}</Text>
    </TouchableOpacity>

    return [close]
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView showsVerticalScrollIndicator={false} onScroll={this._onScroll} scrollEventThrottle={16}>
          <View style={{ paddingBottom: 100 }}>
            {this._renderThumbnail()}
            {this._renderBasicInfo()}
            {this._renderOrderStatus()}
            {this._renderDescription()}
          </View>
        </ScrollView>
        {this._renderCTA()}
      </View>
    );
  }
}

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const { width: viewportWidth } = Dimensions.get('window')

const sliderWidth = viewportWidth

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
