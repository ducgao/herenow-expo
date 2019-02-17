import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  Image,
  BackHandler,
  TouchableOpacity
} from 'react-native'
import string from '../res/string'
import { theme } from '../res/theme'
import HNTextInput from '../component/hnTextInput'
import HNButton from '../component/hnButton'
import Api from '../api'
import { SHOW_LOADING, DialogCombine } from '../component/dialogCombine'
import UserRepository from '../repository/user-repository'
import { LinearGradient } from 'expo'
import ImagePicker from 'react-native-image-picker'

export default class EditProfile extends Component {

  static navigationOptions = { header: null }

  fnameTextInput = null
  lnameTextInput = null
  phoneTextInput = null

  imageObjectToUpload = null

  state = {
    avatarSource: null,
    showTag: null
  }

  api = Api.instance()

  componentWillMount() {
    const userInfo = UserRepository.instance().getUserData()
    this.setState({
      avatarSource: userInfo.avatarUrl
    })
  }

  componentWillUnmount() {
    const requestUpdateUserInfo = this.props.navigation.getParam("requestUpdateUserInfo")
    if (requestUpdateUserInfo) {
      requestUpdateUserInfo()
    }
  }
  

  _onSubmit = () => {
    const newFname = this.fnameTextInput.getText()
    const newLname = this.lnameTextInput.getText()
    const newPhone = this.phoneTextInput.getText()

    var changes = {
      firstName: newFname,
      lastName: newLname
    }

    if (newPhone != null && newPhone.length < 8) {
      alert(string.phone_invalid)
      return
    }

    if (newPhone != null && newPhone.length >= 8) {
      changes = {
        firstName: newFname,
        lastName: newLname,
        phone: newPhone
      }
    }

    this._tryShowLoading()
    if (this.imageObjectToUpload == null) {
      this._doEditProfile(changes)
    }
    else {
      this.api.uploadImage(this.imageObjectToUpload).then(res => {
        if (newPhone != null && newPhone.length >= 8) {
          changes = {
            firstName: newFname,
            lastName: newLname,
            phone: newPhone,
            avatarUrl: res.url
          }
        }
        else {
          changes = {
            firstName: newFname,
            lastName: newLname,
            avatarUrl: res.url
          }
        }

        this._doEditProfile(changes)
      })
      .catch(e => {
        this._tryHideLoading()
        setTimeout(() => {
          alert(e)
        }, 500)
      })
    }
  }

  _doEditProfile(changes) {
    this.api.editProfile(changes).then(res => {
      this._tryHideLoading()
      if (this._isValidUserData(res)) {
        UserRepository.instance().setUserData(res)
        setTimeout(() => {
          alert(string.edit_profile_success)
        }, 500)
      }
      else {
        setTimeout(() => {
          alert(string.edit_profile_fail)
        }, 500)
      }
    })
    .catch(e => {
      this._tryHideLoading()
      setTimeout(() => {
        alert(e)
      }, 500)
    })
  }

  _isValidUserData = (res) => {
    if (res.id == undefined) {
      return false
    }

    return true
  }

  _onSignUpSuccess = () => {
    setTimeout(() => {
      Alert.alert(string.signup_success_title, string.signup_success_message)
      this.props.onSignUpSuccess()
    }, 1000)
  }

  _showSignUpError = () => {
    setTimeout(() => {
      alert(string.error_signup_fail)
    }, 1000)
  }

  _tryShowLoading = () => {
    if (this.props.showLoading) {
      this.props.showLoading()
    }
    else {
      this.setState({ showTag: SHOW_LOADING })
    }
  }

  _tryHideLoading = () => {
    if (this.props.hideLoading) {
      this.props.hideLoading()
    }
    else {
      this.setState({ showTag: null })
    }
  }

  _requestOpenImagePicker = () => {
    const options = {
      title: 'Select Avatar',
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

      const source = { uri: response.uri }
      this.imageObjectToUpload = {
        uri: response.uri,
        type: response.type,
        name: response.fileName
      }
    
      this.setState({
        avatarSource: source,
      })
    })
  }

  render() {
    const userInfo = UserRepository.instance().getUserData()

    const avatarSource = this.state.avatarSource ? this.state.avatarSource : require('../res/images/no_avatar.jpg')
    const content = <ScrollView 
      key="content"
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false} >
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.9} onPress={this._requestOpenImagePicker}>
          <Image 
            style={{
              width: '100%',
              height: 250,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: theme().primary_color
            }}
            source={avatarSource}
            resizeMode='cover'
          />
        </TouchableOpacity>
        <LinearGradient style={{
          position: 'absolute',
          top: 210,
          width: '100%',
          height: 40
        }} colors={['#00000000', '#00000099']}>
          <Text style={{
            color: 'white',
            fontSize: 11,
            fontStyle: 'italic',
            position: 'absolute', 
            right: 8,
            bottom: 8
          }}>{"tap to change"}</Text>
        </LinearGradient>
        <HNTextInput 
          ref={ref => this.fnameTextInput = ref}
          style={{
            marginTop: 30, 
            marginLeft: 16, 
            marginRight: 16
          }}
          initInput={userInfo.firstName}
          title={string.fname}
          placeholder={string.fname_place_holder}
        />
        <HNTextInput 
          ref={ref => this.lnameTextInput = ref}
          style={{
            marginTop: 30, 
            marginLeft: 16, 
            marginRight: 16
          }}
          initInput={userInfo.lastName}
          title={string.lname}
          placeholder={string.lname_place_holder}
        />
        <HNTextInput 
          ref={ref => this.phoneTextInput = ref}
          style={{
            marginTop: 30, 
            marginLeft: 16, 
            marginRight: 16
          }}
          initInput={userInfo.phone}
          title={string.phone_number}
          keyboardType={'numeric'}
          placeholder={string.phone_place_holder}
        />
        
        <HNButton 
          style={{
            marginTop: 40, 
            marginLeft: 16, 
            marginRight: 16, 
            marginBottom: 20
          }}
          text={string.submit}
          onPress={this._onSubmit}
        />
      </View>
    </ScrollView>
    const dialogCombine = <DialogCombine key={'dialogcombine-main'} showTag={this.state.showTag} />
    return [content, dialogCombine]
  }
}


const WINDOW_WIDTH = Dimensions.get('window').width
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
    borderRadius: 12
  }
})
