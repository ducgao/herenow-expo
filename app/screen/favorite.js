import React, {Component} from 'react'
import {
  View,
  Text,
  Dimensions
} from 'react-native'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import Api from '../api'
import { theme } from '../res/theme'
import SavedProviders from './fav-providers'
import SavedPost from './fav-posts'

export default class Favorite extends Component {
  static navigationOptions = { header: null }

  state = {
    index: 0,
    routes: [
      { index: 0, key: 'provider', title: 'Location Content' },
      { index: 1, key: 'post', title: 'Shout Out' }
    ]
  }

  api = Api.instance()

  constructor(props) {
    super(props)

    this.providerInstance = () => <SavedProviders ref={ref => this.buySellRef = ref} {...this.props} />
    this.postInstance = () => <SavedPost ref={ref => this.shoutoutRef = ref} {...this.props} />
  }

  componentDidMount() {
    this.setState({ 
      routes: [
        { index: 0, key: 'provider', title: 'Saved Providers' },
        { index: 1, key: 'post', title: 'Saved Posts' },
      ]
     })
  }

  _onTabIndexChanged = (index) => {
    this.setState({ index })
  }

  _renderLabel = (props) => {
    const route = props.route
    const textColor = this.state.index == route.index ? 'white' : 'white'
    return (
      <View style={{height: 50, justifyContent: 'center'}}>
        <Text style={{color: textColor, fontSize: 12, textAlign: 'center'}} >{route.title}</Text>
      </View>
    )
  }

  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      style={{ backgroundColor: theme().primary_color, height: 50 }}
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
          provider: this.providerInstance,
          post: this.postInstance
        })}
      />
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
