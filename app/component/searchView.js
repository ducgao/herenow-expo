import React, {Component} from 'react'
import {
  TextInput,
  View
} from 'react-native'
import { theme } from '../res/theme'
import string from '../res/string'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class SearchView extends Component {
    state = {
        text: null
    }

    reset = () => {
        this.setState({text: null})
    }

    _onSubmitEditing = () => {
        this.props.onSearch(this.state.text)
    }

    render() {
        return (
        <View style={[{
            backgroundColor: 'white',
            borderRadius: 8,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            flexDirection: 'row'
        }, {...this.props.style}]} >
            <TextInput
            style={{
                width: '92%',
                height: 40,
                paddingLeft: 8
            }}
            value={this.state.text}
            placeholder={string.search}
            onChangeText={t => this.setState({text: t})}
            onSubmitEditing={this._onSubmitEditing}
            secureTextEntry={this.props.secureTextEntry}
            />
            <Icon style={{
                alignSelf: 'center'    
            }} 
            onPress={this.props.onFilterClick}
            name={'sliders'} color={theme().inactive_color} size={20} />
        </View>
        )
    }
}