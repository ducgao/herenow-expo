import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet, 
  Dimensions,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native'
import { theme } from '../res/theme'
import string from '../res/string'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from '../utils/numberextensions'
import { LinearGradient } from 'expo'
import DealList from '../component/deal-list'
import Api from '../api'
import { formatDateTime } from '../utils'

export const PAYMENT_METHOD_PAYPAL = "paypal"
export const PAYMENT_METHOD_CREDIT_CARD = "credit-card"

export default class ProviderDetail extends Component {
  static navigationOptions = { header: null }

  api = Api.instance()

  state = {
    provider: null,
    address: string.fetching,
    deals: null,
    isLoved: false
  }

  componentWillMount() {
    const provider = this.props.navigation.getParam("provider")
    const { isSaved } = provider
    const isLoved = isSaved ? isSaved.count > 0 : false
    this.setState({ 
      provider,
      isLoved
    })

    this.api.getAddressInfo(provider.addressId).then(info => {
      const address = 
        this._displayValue(info.address1) + 
        this._displayValue(info.address2) +
        this._displayValue(info.ward) +
        this._displayValue(info.district) +
        this._displayValue(info.city) +
        this._displayValue(info.country, true)
      this.setState({ address })
    })

    this.api.searchWith([{name: "providerId", value: provider.id}]).then(data => {
      this.setState({ deals: data.data })
    })
  }

  _displayValue(input, isLast) {
    return input ? isLast ? input : (input + ", ") : ""
  }

  _addToWishList = () => {
    if (this.state.isLoved) { return }
    this.api.saveProvider(this.state.provider.id).then(res => {
      if (res.code) {
        Alert.alert("Herenow", "Can not save provider, please try again later!")
      } else {
        Alert.alert("Herenow", "Provider successfully saved!")
        this.setState({
          isLoved: true
        })
      }
    })
    .catch(e => {
      Alert.alert("Herenow", "Can not save provider, please try again later!")
    })
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _onDealClick = (deal) => {
    this.props.navigation.replace("DealDetail", { deal: { deal } })
  }

  _renderHeader() {
    if (this.state.provider) {
      return <View style={{
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH / 1.5,
        backgroundColor: 'white',
        marginBottom: 16
      }}>
        <Image 
          style={{
            width: WINDOW_WIDTH,
            height: WINDOW_WIDTH / 1.5,
            backgroundColor: 'white'
          }}
          source={{ uri: this.state.provider.coverPhotoUrl }}
        />
        <LinearGradient style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 50
        }} colors={['#00000000', '#000']}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          position: 'absolute',
          color: 'white', 
          bottom: 8,
          marginLeft: 16
        }}>{this.state.provider.name}</Text>
        </LinearGradient>
        <View style={{
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          position: 'absolute',
          bottom: 40,
          left: 16
        }}>
          <Image style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'black'
          }} source={this.state.provider.avatarUrl}/>
        </View>
      </View>
    }
  }

  _renderAttributes() {
    if (this.state.provider) {
      const attributes = [
        {
          name: string.phone,
          value: this.state.provider.phone
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
          <Text style={{ 
            width: 100, 
            height: 20, 
            fontWeight: 'bold', 
            fontSize: 14,
            color: theme().text_color
          }} >{attribute.name}</Text>
          <TouchableOpacity onPress={attribute.onPress}>
            <Text style={{ 
              width: WINDOW_WIDTH - 100 - 16 * 2, 
              fontSize: 14, 
              color: theme().text_color,
              fontWeight: attribute.fontWeight ? attribute.fontWeight : null  
            }}>{attribute.value}</Text>
          </TouchableOpacity>
        </View>
      )

      return content
    }
  }

  _renderDescription() {
    if (this.state.provider.description) {
      const title = <Text key='deal-detail-description-title' style={{ 
        color: 'black', 
        marginTop: 16,
        marginLeft: 16, 
        marginRight: 16, 
        fontSize: 20 
      }}>{string.description}</Text>
      const content = <Text key='deal-detail-description-content' style={{ 
        color: theme().inactive_color, 
        marginTop: 8,
        marginLeft: 16, 
        marginRight: 16, 
        fontSize: 14,
        lineHeight: 20
      }}>{this.state.provider.description}</Text>
      return [title, content]
    }
  }

  _renderDeals() {
    var deals = []
    if (this.state.deals) {
      deals = this.state.deals.map((deal) => 
        <DealList 
          style={{ marginLeft: 16, marginTop: 12 }} 
          key={deal.id} 
          data={deal}
          onPress={this._onDealClick}
          />
        )
    }
    else {
      deals = <Text style={{ 
        color: theme().text_color, 
        marginTop: 8,
        fontStyle: 'italic',
        marginLeft: 16, 
        marginRight: 16, 
        fontSize: 14
      }}>{string.fetching}</Text>
    }

    const title = <Text style={{ 
      color: theme().text_title_color, 
      marginTop: 16,
      marginLeft: 16, 
      marginRight: 16, 
      fontSize: 20,
      fontWeight: 'bold'
    }}>{string.deals}</Text>

    return [title, deals]
  }

  _renderCTA() {
    const close = <TouchableOpacity style={{
      position: 'absolute',
      bottom: 32,
      right: 16,
      backgroundColor: theme().primary_color,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    }} onPress={this._onBack} activeOpacity={0.7} key={"deal-detail-close"}>
      <Icon name='close' color='white' size={20} />
    </TouchableOpacity>

    return [close]
  }

  _renderFavorite() {
    return <View style={{
      overflow: 'hidden',
      position: 'absolute',
      top: WINDOW_WIDTH / 1.5 - 22,
      right: 16,
      width: 44, height: 44,
      borderRadius: 22,
      backgroundColor: this.state.isLoved ? theme().accent_color : theme().inactive_color
    }}>
      <Icon style={{
        borderRadius: 22,
        width: 44, height: 44,
        backgroundColor: this.state.isLoved ? theme().accent_color : theme().inactive_color,
        paddingTop: 12,
        paddingLeft: 12
      }}
      name={'tag'}
      size={20}
      color={'white'}
      onPress={this._addToWishList}
    />
      </View>
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView showsVerticalScrollIndicator={false} onScroll={this._onScroll} scrollEventThrottle={16}>
          <View style={{ paddingBottom: 100 }}>
            {this._renderHeader()}
            {this._renderFavorite()}
            {this._renderAttributes()}
            {this._renderDescription()}
            <View style={{ height: 12 }}/>
            {this._renderDeals()}
          </View>
        </ScrollView>
        {this._renderCTA()}
      </View>
    );
  }
}

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
