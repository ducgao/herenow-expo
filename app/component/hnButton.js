import React, {Component} from 'react'
import {
  Text, 
  TouchableOpacity
} from 'react-native'
import { theme } from '../res/theme'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class HNButton extends Component {
    _renderIcon() {
        if (this.props.icon == null || this.props.icon == undefined) {
            return
        }

        return <Icon 
            style={{ alignSelf: 'center', marginRight: 8 }} 
            name={this.props.icon} 
            size={16}
            color={this.props.iconColor}
            />
    }
    render() {
        return (
            <TouchableOpacity {...this.props} 
                style={[
                    {
                        height: 40, 
                        justifyContent: 'center', 
                        borderRadius: 20, 
                        backgroundColor: theme().primary_color,
                        flexDirection: 'row'
                    }, 
                    {...this.props.style}
                    ]}>
                {this._renderIcon()}
                <Text
                    style={{
                        alignSelf: 'center',
                        textAlign: 'center', 
                        color:  this.props.textColor ? this.props.textColor : 'white' }}
                >{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}