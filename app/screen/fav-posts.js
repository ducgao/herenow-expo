import React, {Component} from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native'
import Api from '../api'
import Post from '../component/post'
import string from '../res/string'
import { theme } from '../res/theme'

export default class SavedPost extends Component {
  api = Api.instance()

  currentPostPage = 0

  state = {
    dealsPagingInfo: null,
    posts: null,
    refreshing: false
  }

  componentDidMount() {
    this.requestUpdateData(false)
  }

  requestUpdateData = (force) => {
    if (this.state.posts == null || force) {
      this.api.getSavedPosts().then(data => {
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
      {string.location_content_slogan}
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
        fontSize: 14,
        color: theme().text_color
      }}>{string.no_post}</Text>
    }

    const posts = this.state.posts.map((value, position) => {
      return <Post 
        key={position}
        data={value.post}
        enableSaveButton={true}
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
    this.api.getPost('herenow', page).then(data => {
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
        {this._renderPosts()}
      </ScrollView>
    )
  }
}
