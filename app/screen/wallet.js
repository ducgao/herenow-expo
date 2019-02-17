import React, {Component} from 'react'
import {
  StyleSheet, 
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native'
import Recent from '../component/recent'
import string from '../res/string'
import { theme } from '../res/theme'
import { isIphoneX } from '../utils'
import DataRepository from '../repository/data-repository'
import { DialogCombine, SHOW_DEAL_CODE } from '../component/dialogCombine'
import UserRepository from '../repository/user-repository'

export default class Wallet extends Component {
  static navigationOptions = { header: null }

  dataRepository = DataRepository.instance()
  userRepository = UserRepository.instance()
  updatingOffset = new Animated.Value(-40)

  state = {
    deals: null,
    showTag: null,
    isLogged: false
  }

  onDataUpdating = () => {
    setTimeout(() => {
      Animated.timing(this.updatingOffset, { toValue: 0 }).start()
    })
  }

  onDataReady = () => {
    const newWallet = this.dataRepository.getWallet()
    this.setState({ deals: newWallet, isLogged: this.userRepository.isLogged() }, () => { Animated.timing(this.updatingOffset, { toValue: -40 }).start() })
  }

  _onDealClick = (deal) => {
    this.setState({ showTag: SHOW_DEAL_CODE })
  }

  _renderDeals() {
    const content = this.state.deals == null ?
      <ActivityIndicator style={{ marginLeft: 16, marginTop: 16, alignSelf: 'flex-start' }} /> 
      :
      this.state.deals.length == 0 ?
        <Text style={{ 
          marginLeft: 16, 
          marginTop: 16, 
          fontStyle: 'italic', 
          fontSize: 13, 
          color: theme().text_color,
          alignSelf: 'flex-start' 
        }} >
          {this.state.isLogged ? string.wallet_empty : string.wallet_not_loggin_message}
        </Text>
        :
        this.state.deals.map((recent) => 
          <Recent 
            style={{ marginLeft: 16, marginTop: 12 }} 
            key={recent.id} 
            data={recent.deal}
            name={recent.deal.name}
            thumbnail={recent.deal.coverPhotoUrl}
            onPress={this._onDealClick}
          />
        )

    return (
      <View 
        style={{
          marginTop: 16,
          paddingBottom: 16,
          width: WINDOW_WIDTH
        }}
      >
        <Text style={{ 
          paddingLeft: 16, 
          fontSize: 24, 
          fontWeight: 'bold',
          color: theme().text_color
        }} >{string.your_wallet}</Text>
        {content}
      </View>
    )
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

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView style={{ marginTop: (isIphoneX() ? 32 : 16)}} showsVerticalScrollIndicator={false} >
          <View>
            {this._renderDeals()}
          </View>  
        </ScrollView>
        {this._renderUpdatingIndicator()}
        <DialogCombine showTag={this.state.showTag} touchOutsideToDismiss={true}/>
      </View>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
