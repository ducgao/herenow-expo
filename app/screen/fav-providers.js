import React, {Component} from 'react'
import {
  Text,
  ScrollView,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import Api from '../api'
import string from '../res/string'
import { theme } from '../res/theme'
import HomeProvider from '../component/home-provider'

export default class SavedProviders extends Component {
  static navigationOptions = { header: null }

  api = Api.instance()

  state = {
    dealsPagingInfo: null,
    providers: null,
    refreshing: false
  }

  componentDidMount() {
    this.requestUpdateData(false)
  }

  requestUpdateData = (force) => {
    if (this.state.providers == null || force) {
      this.api.getSavedProviders().then(data => {
        this.setState({
          dealsPagingInfo: {
            total: data.total,
            limit: data.limit,
            skip: data.skip
          },
          providers: data.data,
          refreshing: false
        })
      })
      .catch(e => {
        // alert(e)
        this.setState({
          refreshing: false
        })
      })
    }
  }

  _onProviderClick = (provider) => {
    const mainContent = provider.provider
    const _provider = {
      ...mainContent,
      isSaved: { count: 1 }
    }

    this.props.navigation.navigate('ProviderDetail', { provider: _provider })
  }

  _renderProviders() {
    if (this.state.providers == null) {
      return <View style={{ flexDirection: 'row', marginLeft: 16, marginTop: 16 }}>
        <ActivityIndicator/>
        <Text style={{ 
          marginLeft: 8, 
          fontStyle: 'italic', 
          fontSize: 14,
          color: theme().text_color
        }} >{string.fetching}</Text>
      </View>
    }

    const providers = this.state.providers.map((value, position) => {
      return <HomeProvider
        fullSize={true}
        style={{ marginLeft: 16, marginBottom: 8 }} 
        key={value.id} 
        data={value}
        onPress={this._onProviderClick}
      />
    })

    return providers
  }

  render() {
    return (
      <ScrollView 
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }} 
        showsVerticalScrollIndicator={false}>
        {this._renderProviders()}
      </ScrollView>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height