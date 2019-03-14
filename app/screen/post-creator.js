import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native'
import string from '../res/string'
import { theme } from '../res/theme'
import HNTextInput from '../component/hnTextInput'
import HNButton from '../component/hnButton'
import Api from '../api'
import { SHOW_LOADING, DialogCombine } from '../component/dialogCombine'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ImagePicker from 'react-native-image-picker'

export default class SignUp extends Component {
  static navigationOptions = { header: null }

  titleTextInput = null
  contentTextInput = null

  state = {
    showTag: null,
    images: []
  }

  api = Api.instance()
  imagesObjectToUpload = []
  createType = null

  constructor(props) {
    super(props)

    this.createType = props.navigation.getParam("type")
  }

  _requestOpenImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return
      } 

      if (response.error) {
        alert(response.error)
        return
      }

      this.imagesObjectToUpload.push({
        uri: response.uri,
        type: response.type,
        name: response.fileName
      })

      const currentImages = this.state.images.slice()
      currentImages.push(response)
      this.setState({
        images: currentImages
      })
    })
  }

  _requestCreatePost = () => {
    const title = this.titleTextInput.getText()
    const content = this.contentTextInput.getText()
    const images = this.state.images

    if (title == null) {
      alert(string.create_post_missing_title)
      return
    }

    if (content == null) {
      alert(string.create_post_missing_content)
      return
    } 

    // if (images.length == 0) {
    //   alert(string.create_post_missing_images)
    //   return
    // }

    this.setState({
      showTag: SHOW_LOADING
    }, () => {
      this._uploadImages().then(imgs => {
        this.api.createPost(this.createType, title, content, imgs).then(() => {
          this.setState({ showTag: null }, () => {
            this.props.navigation.goBack()
            const requetsCallback = this.props.navigation.getParam("callback")
            if (requetsCallback) {
              requetsCallback()
            }
          })
        })
        .catch(e => {
          this.setState({ showTag: null }, () => {
            setTimeout(() => { alert(e) }, 500)
          })
        })
      })
    })
  }

  _uploadImages() {
    const imagesToUpload = this.imagesObjectToUpload.slice()
    return new Promise((resolve, rejecter) => {
      this._uploadImage(imagesToUpload, resolve, rejecter, [])
    }) 
  }

  _uploadImage(images, resolve, rejecter, result) {
    if (images.length == 0) {
      resolve(result)
      return
    }

    const img = images.pop()
    this.api.uploadImage(img).then(res => {
      result.push({
        url: res.url,
			  type: "image"
      })
      this._uploadImage(images, resolve, rejecter, result)
    })
    .catch(e => {
      rejecter(e)
    })
  }

  _renderBasicInput() {
    const title = <HNTextInput 
      ref={ref => this.titleTextInput = ref}
      style={{marginTop: 30}}
      title={string.post_title}
      placeholder={string.post_title_place_holder}
    />

    const content = <HNTextInput 
      ref={ref => this.contentTextInput = ref}
      style={{marginTop: 30}}
      autoGrow={true}
      title={string.post_content}
      placeholder={string.post_content_place_holder}
    />

    return [title, content]
  }

  _renderImagePicker() {
    const title = <Text style={{
      marginTop: 16
    }}>{string.images.toUpperCase()}</Text>

    const images = this.state.images
    const numberOfItem = images.length + 1
    const lines = Number.parseInt(numberOfItem / 3) + (numberOfItem % 3 == 0 ? 0 : 1)

    const displayContent = []
    for (let index = 0; index < lines; index++) {
      const realIndex = index * 3
      var item1 = null
      var item2 = null
      var item3 = null

      item1 = realIndex == images.length ? this._renderImagePickerItem() : realIndex < images.length ? this._renderImageItem(realIndex) : null
      item2 = (realIndex + 1) == images.length ? this._renderImagePickerItem() : (realIndex + 1) < images.length ? this._renderImageItem(realIndex + 1) : null
      item3 = (realIndex + 2) == images.length ? this._renderImagePickerItem() : (realIndex + 2) < images.length ? this._renderImageItem(realIndex + 2) : null

      const content = []
      content.push(item1)
      content.push(item2)
      content.push(item3)

      displayContent.push(<View style={{ flexDirection: 'row' }}>{content}</View>)
    }

    return [title, displayContent]
  }

  _renderImageItem(index) {
    const image = this.state.images[index]
    const imageSource = {uri: image.uri}
    return <Image
      source={imageSource}
      style={{ 
        marginTop: 12,
        marginRight: 8,
        width: IMAGE_SIZE, 
        height: IMAGE_SIZE, 
        backgroundColor: theme().image_background
    }}/>
  } 

  _renderImagePickerItem() {
    return <TouchableOpacity 
      onPress={this._requestOpenImagePicker}
      activeOpacity={0.5} 
      style={{
        height: IMAGE_SIZE, 
        width: IMAGE_SIZE, 
        marginTop: 12,
        backgroundColor: 'white',
        justifyContent: 'center'
    }}>
      <Icon name={'plus'} size={20} style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  }

  _renderCTA() {
    return <HNButton 
      style={{marginTop: 40}}
      text={string.submit}
      onPress={this._requestCreatePost}
    />
  }

  render() {
    const content = <ScrollView 
      key="content"
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false} >
      <Text style={{
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        fontSize: 24,
        marginLeft: 20,
        marginRight: 20
      }}>{string.post_creator}</Text>
      <View style={styles.card}>
        {this._renderBasicInput()}
        {this._renderImagePicker()}
        {this._renderCTA()}
      </View>
    </ScrollView>
    const dialogCombine = <DialogCombine key={'dialogcombine-main'} showTag={this.state.showTag} />
    return [content, dialogCombine]
  }
}


const WINDOW_WIDTH = Dimensions.get('window').width
const IMAGE_SIZE = (WINDOW_WIDTH - 40 - 32 - 16) / 3
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: null,
  },
  card: {
    marginTop: 20,
    width: WINDOW_WIDTH * 0.9,
    backgroundColor: theme().secondary_color,
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16
  }
})
