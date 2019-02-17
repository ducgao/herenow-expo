import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  ScrollView,
  View,
  Alert
} from 'react-native'
import string from '../res/string'
import { theme } from '../res/theme'
import HNTextInput from '../component/hnTextInput'
import HNButton from '../component/hnButton'
import Api from '../api'
import { SHOW_LOADING, DialogCombine } from '../component/dialogCombine'

export default class SignUp extends Component {

  fnameTextInput = null
  lnameTextInput = null
  emailTextInput = null
  passwordTextInput = null

  state = {
    showTag: null
  }

  api = Api.instance()

  _onSignUp = () => {
    const fname = this.fnameTextInput.getText()
    const lname = this.lnameTextInput.getText()
    const email = this.emailTextInput.getText()
    const pass = this.passwordTextInput.getText()

    if (fname == null || lname == null || email == null || pass == null) {
      alert(string.error_missing_field)
      return
    }

    this._tryShowLoading()
    this.api.signUp(fname, lname, email, pass)
    .then(res => {
      this._tryHideLoading()
      if (res.code) {
        this._showSignUpError()
      }
      else {
        this._onSignUpSuccess()
      }
    })
    .catch(_ => {
      this._tryHideLoading()
      this._showSignUpError()
    })
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

  render() {
    const content = <ScrollView 
      key="content"
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false} >
      <View style={styles.card}>
        <HNTextInput 
          ref={ref => this.fnameTextInput = ref}
          style={{marginTop: 30}}
          title={string.fname}
          placeholder={string.fname_place_holder}
        />
        <HNTextInput 
          ref={ref => this.lnameTextInput = ref}
          style={{marginTop: 30}}
          title={string.lname}
          placeholder={string.lname_place_holder}
        />
        <HNTextInput 
          ref={ref => this.emailTextInput = ref}
          style={{marginTop: 30}}
          title={string.email}
          placeholder={string.email_place_holder}
          verifyMethod='email'
        />
        <HNTextInput 
          ref={ref => this.passwordTextInput = ref}
          style={{marginTop: 30}}
          title={string.password}
          placeholder={string.password_place_holder}
          secureTextEntry={true}
          verifyMethod='password'
        />
        <HNButton 
          style={{marginTop: 40}}
          text={string.sign_up}
          onPress={this._onSignUp}
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
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16
  }
})
