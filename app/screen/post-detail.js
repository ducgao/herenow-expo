import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
  Keyboard,
  Text,
  TextInput
} from 'react-native'
import { theme } from '../res/theme'
import string from '../res/string'
import _ from '../utils/numberextensions'
import Api from '../api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import Carousel from 'react-native-snap-carousel'
import Comment from '../component/comment'
import UserRepository from '../repository/user-repository'

export default class PostDetail extends Component {
  static navigationOptions = { header: null }

  currentCommentsPage = 0

  api = Api.instance()

  state = {
    post: null,
    isLoadingImage: false,
    gallery: [],
    commentsPagingInfo: null,
    comments: null,
    userComment: null,
    sendingComment: false
  }

  componentWillMount() {
    const post = this.props.navigation.getParam("post")
    this.setState({ post, isLoadingImage: true })

    this.api.getGallery(post.galleryId).then(res => {
      this.setState({ gallery: Array.isArray(res.data) ? res.data : [], isLoadingImage: false })
    })
    
    this.api.getPostComment(post.id).then(res => {
      const comments = Array.isArray(res.data) ? res.data : []
      this.setState({ 
        commentsPagingInfo: {
          total: res.total,
          limit: res.limit,
          skip: res.skip
        },
        comments })
    })
  }

  _openGallery = (index) => {
    var photos = []
    photos.push({url: this.state.post.coverUrl})
    if (this.state.gallery) {
      this.state.gallery.forEach(i => {
        photos.push(i)
      })
    }

    this.props.navigation.navigate('PhotoGallery', { images: photos, index })
  }

  _renderImageItem = ({item, index}) => {
    return (
      <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => this._openGallery(index)}>
        <Image style={{ 
          width: WINDOW_WIDTH - 16 * 2, 
          height: WINDOW_WIDTH - 16 * 2, 
          borderRadius: 8, 
          marginTop: 12,
          backgroundColor: theme().image_background
        }} source={{ uri: item.url }} resizeMode='cover' />
      </TouchableOpacity>
    )
  }

  _renderImages() {
    var photos = []
    photos.push({url: this.state.post.coverUrl})
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
      <Text style={{ 
        fontSize: 11, 
        alignSelf: 'center', 
        marginLeft: 4,
        color: theme().text_color
      }}>{string.fetching}</Text>
    </View>
    
    return <View style={{ height: WINDOW_WIDTH }}>
      <Carousel 
        data={photos}
        layout={'default'}
        renderItem={this._renderImageItem}
        sliderWidth={sliderWidth}
        itemWidth={WINDOW_WIDTH - 16 * 2}
      />
      {this.state.isLoadingImage ? loadingIndicator : null}
    </View>
  }

  _renderBasicInfo() {
    const post = this.state.post

    if (post == null) {
      return null
    }

    const title = <Text style={{
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginLeft: 16, 
      marginRight: 16,
      color: theme().text_title_color,
      lineHeight: 28,
      fontSize: 26 
    }}>{post.title}</Text>
    const description = <Text style={{
      marginLeft: 16, 
      marginRight: 16,
      lineHeight: 18,
      fontSize: 12,
      color: theme().text_color
    }}>{post.content}</Text>

    return [title, description]
  }

  _renderComment() {
    const post = this.state.post

    if (post == null) {
      return null
    }

    const date = moment(new Date(post.createdAt), 'DD/MM/YYYY').format('DD/MM/YYYY')
    const separator = <View style={{
      width: '100%',
      height: 0.5,
      marginTop: 12,
      backgroundColor: 'gray'
    }}/>
    const header = <View style={{ 
      flexDirection: 'row', 
      marginTop: 8, 
      marginBottom: 8, 
      marginLeft: 16, 
      marginRight: 16
    }}>
      <Icon style={{ marginTop: 2 }} name="comment-alt" size={14} color={theme().text_color}/>
      <Text style={{
        fontSize: 12,
        marginLeft: 4,
        color: theme().text_color
      }}>{post.commentCount.count}</Text>
      <View style={{
        position: 'absolute',
        right: 0,
        flexDirection: 'row'
      }}>
        <Text style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: theme().text_color
        }}>{'by '}</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: theme().text_color
        }}>{post.user.displayName}</Text>
        <Text style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: theme().text_color
        }}>{' - ' + date}</Text>
      </View>
    </View>

    var comments = null

    if (this.state.comments == null) {
      comments = <Text style={{ 
        fontSize: 12, 
        alignSelf: 'flex-start', 
        fontStyle: 'italic',
        color: theme().text_color,
        marginLeft: 16 }}>{string.fetching}</Text>
      
      return [separator, header, comments]
    }

    if (this.state.comments.length == 0) {
      comments = <Text style={{ 
        fontSize: 12, 
        alignSelf: 'flex-start', 
        fontStyle: 'italic',
        marginLeft: 16 }}>{string.no_comment}</Text>

      return [separator, header, comments]
    }

    comments = this.state.comments.map((value, index) => {
      return <Comment 
        key={index}
        data={value}
      />
    })

    const loadMore = this.state.commentsPagingInfo == null ? null : this._renderLoadMore()
    return [separator, header, comments, loadMore]
  }

  _renderLoadMore() {
    const pagingInfo = this.state.commentsPagingInfo
    if (pagingInfo == null) {
      return null
    }

    const currentDisplayCommentsCount = pagingInfo.skip + pagingInfo.limit
    if (currentDisplayCommentsCount >= pagingInfo.total) {
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

  _isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0.5
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  _loadMore = (page) => {
    this.api.getPostComment(this.state.post.id, page).then(data => {
      var newComments = this.state.comments
      data.data.forEach(i => newComments.push(i))
      this.setState({
          commentsPagingInfo: {
            total: data.total,
            limit: data.limit,
            skip: data.skip
          },
          comments: newComments
        })
      })
      .catch(e => {
        alert(e)
      })
  }

  _submitComment = () => {
    if (UserRepository.instance().isLogged()) {
      this._sendComment()
    }
    else {
      this._openAuth()
    }
  }

  _sendComment = () => {
    this.setState({ sendingComment: true }, () => {
      Keyboard.dismiss()
      this.api.postComment(this.state.post.id, this.state.userComment).then(res => {
        var newComments = [res]
        this.state.comments.forEach(i => newComments.push(i))
        this.setState({ comments: newComments, sendingComment: false, userComment: null }, () => {
          this._scrollView.scrollTo(100)
        })
      }).catch(err => {
        alert(err)
      })
    })
  }

  _openAuth = () => {
    this.props.navigation.navigate('Auth')
  }

  render() {

    const sendCommentIcon = this.state.sendingComment ? 
      <ActivityIndicator style={{ width: 28, height: 28, alignSelf: 'center' }} /> : 
      <Icon 
        name="arrow-up" 
        size={22}
        style={{ 
          alignSelf: 'center', 
          backgroundColor: 'white', 
          padding: 8,
          borderRadius: 8
        }} 
        onPress={this._submitComment}
        color={theme().primary_color}
      />

    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView 
          ref={ref => this._scrollView = ref}
          onScroll={({nativeEvent}) => {
            if (this._isCloseToBottom(nativeEvent)) {
              this.currentCommentsPage += 1
              this._loadMore(this.currentCommentsPage)
            }
          }}
          showsVerticalScrollIndicator={false}
          style={[styles.container, { backgroundColor: theme().app_background }]} 
          contentContainerStyle={{ paddingBottom: 16 }}>
          {this._renderImages()}
          {this._renderBasicInfo()}
          {this._renderComment()}
        </ScrollView>
        <View style={{ width: WINDOW_WIDTH, height: 1, backgroundColor: '#c0c0c0' }}/>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TextInput 
            style={{ 
              width: WINDOW_WIDTH - 16 * 2 - 8 - 28,
              marginTop: 12,
              marginBottom: 12,
              marginRight: 8,
              borderRadius: 4,
              backgroundColor: 'white',
              height: 40,
              paddingLeft: 8,
          }}
            value={this.state.userComment}
            onChangeText={text => this.setState({ userComment: text })}
            placeholder={string.write_comment_place_holder}
            placeholderTextColor='gray'
          />
          {sendCommentIcon}
        </View>
      </View> 
    )
  }
}

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const { width: viewportWidth } = Dimensions.get('window')
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

const sliderWidth = viewportWidth

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
