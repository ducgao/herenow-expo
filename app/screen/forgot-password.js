import React, {Component} from 'react'
import {
  Dimensions, 
  StyleSheet, 
  ScrollView,
  View,
  Text
} from 'react-native'
import string from '../res/string'
import { theme } from '../res/theme'
import HNTextInput from '../component/hnTextInput'
import HNButton from '../component/hnButton'
import Api from '../api'

export default class ForgotPassword extends Component {
  static navigationOptions = { header: null }

  emailTextInput = null

  api = Api.instance()

  _onSubmit = () => {
    const email = this.emailTextInput.getText()
    if (email == null) {
      alert(string.email_not_valid)
      return
    }
    this.api.getResetCode(email)
    .then(res => {
      alert(JSON.stringify(res))
    })
    .catch(err => {
      alert(err)
    })
  }

  render() {
    const content = <ScrollView 
      key="content"
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false} >
      <View style={styles.card}>
        <Text style={{ 
          fontStyle: 'italic',
          fontSize: 14
        }}>{string.forgot_password_hint}</Text>
        <HNTextInput 
          ref={ref => this.emailTextInput = ref}
          style={{marginTop: 30}}
          title={string.email}
          verifyMethod={'email'}
          placeholder={string.email_place_holder}
        />
        <HNButton 
          style={{marginTop: 40}}
          text={string.submit}
          onPress={this._onSubmit}
        />
      </View>
    </ScrollView>
    return [content]
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
