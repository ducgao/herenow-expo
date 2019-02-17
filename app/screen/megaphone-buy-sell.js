import React, {Component} from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import Api from '../api'
import Post from '../component/post'
import string from '../res/string'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { theme } from '../res/theme' 

export default class MGPMarket extends Component {

  api = Api.instance()

  currentPostPage = 0

  state = {
    dealsPagingInfo: null,
    posts: null,
    refreshing: false
  }

  requestUpdateData = (force) => {
    if (this.state.posts == null || force) {
      this.api.getPost('market').then(data => {
        this.setState({
          dealsPagingInfo: {
            total: data.total,
            limit: data.limit,
            skip: data.skip
          },
          posts: data.data,
          refreshing: false
        })
      })
      .catch(e => {
        alert(e)
        this.setState({
          refreshing: false
        })
      })
    }
  }

  _onPostClick = (post) => {
    this.props.navigation.navigate("PostDetail", { post })
  }

  _renderSlogan() {
    return <Text style={{
      fontSize: 14,
      color: theme().text_color,
      fontStyle: 'italic', 
      marginTop: 12,
      marginLeft: 16, 
      marginRight: 16
    }}>
      {string.buy_sell_slogan}
    </Text>
  }

  _renderPosts() {
    if (this.state.posts == null) {
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

    if (this.state.posts.length == 0) {
      return <Text style={{ 
        marginLeft: 16, 
        marginTop: 16,
        fontStyle: 'italic', 
        fontSize: 14 ,
        color: theme().text_color
      }}>{string.no_post}</Text>
    }

    const posts = this.state.posts.map((value, position) => {
      return <Post 
        key={position}
        data={value}
        onPress={this._onPostClick}
      />
    })

    const loadMore = this.state.dealsPagingInfo == null ? null : this._renderLoadMore()
    return [posts, loadMore]
    
  }

  _renderLoadMore() {
    const pagingInfo = this.state.dealsPagingInfo
    if (pagingInfo == null) {
      return null
    }

    const currentDisplayDealsCount = pagingInfo.skip + pagingInfo.limit
    if (currentDisplayDealsCount >= pagingInfo.total) {
      return null
    }

    return <View style={{ 
      paddingTop: 16,
      paddingBottom: 12,
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

  _renderCTA() {
    const close = <TouchableOpacity style={{
      position: 'absolute',
      right: 20,
      bottom: 12,
      backgroundColor: theme().button_active,
      height: 40,
      width: 40,
      borderRadius: 20,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center'
    }} onPress={this._requestNewPost} activeOpacity={0.7}>
      <Icon name='plus' color={'white'} size={20} />
    </TouchableOpacity>

    return [close]
  }

  _requestNewPost = () => {
    this.props.navigation.navigate('PostCreator')
  }

  _onRefresh = () => {
    this.currentPostPage = 0
    this.setState({
      refreshing: true
    }, () => {
      this.requestUpdateData(true)
    })
  }

  _isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0.5
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  _loadMore = (page) => {
    this.api.getPost('market', page).then(data => {
      var newPosts = this.state.posts
      data.data.forEach(i => newPosts.push(i))
      this.setState({
          dealsPagingInfo: {
            total: data.total,
            limit: data.limit,
            skip: data.skip
          },
          posts: newPosts,
          refreshing: false
        })
      })
      .catch(e => {
        alert(e)
        this.setState({
          refreshing: false
        })
      })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          onScroll={({nativeEvent}) => {
            if (this._isCloseToBottom(nativeEvent)) {
              this.currentPostPage += 1
              this._loadMore(this.currentPostPage)
            }
          }}
          contentContainerStyle={{ paddingBottom: 12 }} 
          showsVerticalScrollIndicator={false}>
          {this._renderSlogan()}
          {this._renderPosts()}
        </ScrollView>
        {this._renderCTA()}
      </View>
    )
  }
}
