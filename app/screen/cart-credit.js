import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity, 
  View, 
  Text,
  ScrollView,
  Keyboard
} from 'react-native';
import HNButton from '../component/hnButton'
import string from '../res/string'
import { CreditCardInput } from 'react-native-credit-card-input'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { theme } from '../res/theme'

export default class Cart extends Component {
  static navigationOptions = { header: null }

  state = {
    deal: null,
    quantity: 1
  }

  componentWillMount() {
    this.setState({
      deal: this.props.navigation.getParam("deal")
    })
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _renderCTA() {
    const buttonWidth = WINDOW_WIDTH - 16 * 2
    const process = <HNButton 
      key='cart-paypal-button' 
      style={{ width: buttonWidth, backgroundColor: 'white' }} 
      textColor='black' 
      text={string.submit}
      onPress={this._resetFilter} />
    const cancel = <HNButton 
      key='cart-credit-card-button' 
      style={{ width: buttonWidth, marginTop: 12 }} 
      text={string.cancel} 
      onPress={this._onBack} />

    return [process, cancel]
  }

  _renderQuantitySelect() {
    const quantity = this.state.quantity
    const minusColor = quantity <= 1 ? '#e0e0e0' : theme().primary_color
    return <View style={{ width: 150, marginLeft: 16, flexDirection: 'row' }}>
      <TouchableOpacity style={{ 
        backgroundColor: minusColor, 
        width: 20, 
        height: 20, 
        justifyContent: 'center' 
      }} onPress={() => { if (quantity > 1) this.setState({ quantity: quantity - 1})}}>
        <Icon name="minus" size={10} style={{ alignSelf: 'center' }} color='white' />
      </TouchableOpacity>
      <Text style={{ fontSize: 12, paddingLeft: 8, paddingRight: 8, marginTop: 3 }} >{this.state.quantity}</Text>
      <TouchableOpacity style={{ 
        backgroundColor: theme().primary_color, 
        width: 20, 
        height: 20, 
        justifyContent: 'center' 
      }} onPress={() => this.setState({ quantity: quantity + 1})}>
        <Icon name="plus" size={10} style={{ alignSelf: 'center' }} color='white'/>
      </TouchableOpacity>
    </View>
  }

  render() {
    if (this.state.deal == null) {
      return null
    }

    const bestCase = WINDOW_HEIGHT - 300 - 150
    const calculateHeaderHeight = bestCase > 200 ? bestCase : null

    const total = (this.state.deal.deal.price * this.state.quantity).formatMoney() + " (cent)"

    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', width: WINDOW_WIDTH, height: WINDOW_HEIGHT }} onPress={Keyboard.dismiss} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 16 }}>
            <View style={{ height: calculateHeaderHeight, width: WINDOW_WIDTH }} >
              <View style={{ backgroundColor: 'white', paddingBottom: 16 }}>
                <Text style={{
                  fontWeight: 'bold',
                  marginLeft: 16, 
                  marginRight: 16,
                  marginTop: 32,
                  fontSize: 26 
                }}>{this.state.deal.deal.name}</Text>
                <Text style={{
                  marginLeft: 16, 
                  marginRight: 16, 
                  marginBottom: 16, 
                  fontSize: 14 
                }}>{this.state.deal.deal.shortDesc}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginLeft: 16, width: 150, height: 20, fontWeight: 'bold', fontSize: 12 }} >{string.quantity}</Text>
                  <Text style={{ marginLeft: 16, width: 100, height: 20, fontWeight: 'bold', fontSize: 12 }} >{string.total_amount}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {this._renderQuantitySelect()}
                  <Text style={{ marginLeft: 16, marginTop: 3, width: 100, height: 20, fontSize: 12 }} >{total}</Text>
                </View>
              </View>
            </View>
            <View style={{ height: 300, marginTop: 16 }}>
              <CreditCardInput labelStyle={{ color: theme().text_color }} />
            </View>
            <View style={{ paddingLeft: 16  }}>
              {this._renderCTA()}  
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
