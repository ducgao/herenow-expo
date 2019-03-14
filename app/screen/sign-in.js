import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  View,
  Text
} from 'react-native'
import string from '../res/string'
import { theme } from '../res/theme'
import HNTextInput from '../component/hnTextInput'
import HNButton from '../component/hnButton'
import Api from '../api'
// import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
// import GoogleSignIn from 'react-native-google-sign-in'
import { SHOW_LOADING, DialogCombine } from '../component/dialogCombine'

export default class SignIn extends Component {

  emailTextInput = null
  passwordTextInput = null

  state = {
    showTag: null
  }

  api = Api.instance()

  _onSignInClick = () => {
    const email = this.emailTextInput.getText()
    const pass = this.passwordTextInput.getText()

    if (email == null || pass == null) {
      alert(string.error_missing_field)
      return
    }

    this._tryShowLoading()
    this.api.signIn(email, pass)
    .then(res => {
      if (res.code) {
        this._tryHideLoading()
        this._showSignInError()
      }
      else {
        this.props.onSignInSuccess(res.accessToken)
      }
    })
    .catch(_ => {
      this._tryHideLoading()
      this._showSignInError()
    })
  }

  _showSignInError = () => {
    setTimeout(() => {
      alert(string.error_signin_fail)
    }, 1000)
  }

  _onSignInFacebookClick = () => {
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
      result => {
        if (result.isCancelled) {
          alert(string.login_cancelled)
        } else {
          this._tryShowLoading()
          this._getFaceInfo()
        }
      },
      error => {
        alert(error)
      }
    )
  }

  _onSignInGoogleClick = () => {
    GoogleSignIn.configure({
      // This is client key for release, please remove the comment bellow to active release mode
      clientID: '330692496846-vu3sjbdqhic5a07dr7g63vc041l4cacr.apps.googleusercontent.com',
      // clientID: '330692496846-b93k1g2841a0cd8c7fv1as836k9ra0dq.apps.googleusercontent.com',
      serverClientID: '330692496846-9fbd64pg83f6ug1a8vkfannqj3kuh2t0.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile'],
      shouldFetchBasicProfile: true
    }).then(() => {
      GoogleSignIn.signInPromise()
      .then(res => {
        const userID = res.userID
        const name = res.name

        this._processLoginWithThirdParty(userID, name)
      })
      .catch(e => alert(JSON.stringify(e)))
    })
  }

  _openForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword')
  }

  _responseInfoCallback = (error, result) => {
    if (error) {
      alert(error)
    } else {
      const userID = result.id
      const name = result.name

      this._processLoginWithThirdParty(userID, name)      
    }
  }

  _getFaceInfo = () => {
    const infoRequest = new GraphRequest(
      '/me',
      null,
      this._responseInfoCallback,
    )
    new GraphRequestManager().addRequest(infoRequest).start()
  }

  _processLoginWithThirdParty = (userID, name) => {
    this._tryShowLoading()
    this.api.signUp(name, "", userID + "@herenow.com", userID)
    .then(_ => this._continueLoginWithThridParty(userID))
    .catch(_ => this._continueLoginWithThridParty(userID))
  }

  _continueLoginWithThridParty = (userID) => {
    this.api.signIn(userID + "@herenow.com", userID)
    .then(res => {
      if (res.code) {
        this._tryHideLoading()
        this._showSignInError()
      }
      else {
        this.props.onSignInSuccess(res.accessToken)
      }
    })
    .catch(_ => {
      this._tryHideLoading()
      this._showSignInError()
    })
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

  _renderInputBlock() {
    const email = <HNTextInput 
      ref={ref => this.emailTextInput = ref}
      style={{marginTop: 30}}
      title={string.email}
      placeholder={string.email_place_holder}
      verifyMethod='email'
    />

    const password = <HNTextInput 
      ref={ref => this.passwordTextInput = ref}
      style={{marginTop: 30}}
      title={string.password}
      placeholder={string.password_place_holder}
      secureTextEntry={true}
      verifyMethod='password'
    />

    return [email, password]
  }

  _renderCTABlock() {
    const tradition = <HNButton 
      style={{marginTop: 40}}
      text={string.sign_in}
      onPress={this._onSignInClick}
    />

    const facebook = <HNButton 
      style={{marginTop: 20, backgroundColor: theme().app_background}}
      text={string.facebook}
      icon='facebook'
      iconColor={'#3b5998'}
      textColor={'gray'}
      onPress={this._onSignInFacebookClick}
    />

    const gmail = <HNButton 
      style={{marginTop: 20, backgroundColor: theme().app_background}}
      text={string.google}
      icon='google'
      iconColor={'#d06051'}
      textColor={'gray'}
      onPress={this._onSignInGoogleClick}
    />

    return [tradition, facebook, gmail]
  }

  _renderForgotPassword() {
    const fgpw = <TouchableOpacity onPress={this._openForgotPassword} style={{
      marginTop: 24,
      justifyContent: 'center'
    }}>
      <Text style={{
        alignSelf: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        textDecorationLine: 'underline',
        color: theme().link_color
      }}>{string.forgot_password}</Text>
    </TouchableOpacity>

    return [fgpw]
  }

  render() {
    const content = <ScrollView 
      key="content"
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false} >
      <View style={styles.card}>
        {this._renderInputBlock()}
        {this._renderCTABlock()}
        {this._renderForgotPassword()}
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
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16
  }
})
