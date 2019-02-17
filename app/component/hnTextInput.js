import React, {Component} from 'react'
import {
  Text, 
  TextInput,
  View
} from 'react-native'
import { theme } from '../res/theme'
import { isValidEmail } from '../utils'

export default class HNTextInput extends Component {
    /*
    status will be normal/error/valid
     */
    constructor(props) {
        super(props)
        
        this.state = {
            status: props.initInput ? 'valid' : 'normal',
            input: props.initInput ? props.initInput : null
        }
    }

    _verifyInput = (input) => {
        if (input == '') {
            this.setState({ 
                status: 'normal',
                input 
            })
            return
        }

        if (this.props.verifyMethod === 'email') {
            this.setState({ 
                status: isValidEmail(input) ? 'valid' : 'error',
                input
            })
            return
        }

        if (this.props.verifyMethod === 'password') {
            this.setState({ 
                status: input.length >= 8 ? 'valid' : 'error',
                input 
            })
            return
        }

        this.setState({ 
            status: 'valid',
            input
        })
    }

    getText = () => {
        if (this.state.status == 'error' || this.state.status == 'normal') {
            return null
        }

        return this.state.input
    }

    render() {
        if (this.props.autoGrow == true) {
            return this._renderAutoGrow()
        }
        else {
            return this._renderNormal()
        }

    }

    _renderAutoGrow() {
        const indicatorColor = this.state.status == 'normal' ? '#e0e0e0' : this.state.status == 'valid' ? theme().primary_color : 'red'
        return (
        <View style={this.props.style} >
            <Text>{this.props.title.toUpperCase()}</Text>
            <TextInput
            style={{ 
                marginTop: 8,
                backgroundColor: 'white',
                minHeight: 40,
                paddingLeft: 8
            }}
            value={this.state.input}
            multiline={true}
            placeholder={this.props.placeholder}
            onChangeText={this._verifyInput}
            secureTextEntry={this.props.secureTextEntry}
            />
            <View
            style={{
                height: 1,
                backgroundColor: indicatorColor
            }}
            />
        </View>
        )
    }

    _renderNormal() {
        const indicatorColor = this.state.status == 'normal' ? '#e0e0e0' : this.state.status == 'valid' ? theme().primary_color : 'red'
        return (
        <View style={this.props.style} >
            <Text>{this.props.title.toUpperCase()}</Text>
            <TextInput
            style={{ 
                marginTop: 8,
                backgroundColor: 'white',
                height: 40,
                paddingLeft: 8
            }}
            value={this.state.input}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            onChangeText={this._verifyInput}
            secureTextEntry={this.props.secureTextEntry}
            />
            <View
            style={{
                height: 1,
                backgroundColor: indicatorColor
            }}
            />
        </View>
        )
    }
}