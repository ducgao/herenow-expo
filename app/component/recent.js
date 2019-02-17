import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo'

const WINDOW_WIDTH = Dimensions.get('window').width
export default class Recent extends Component {

    _onPress = () => {
        if (this.props.onPress) {
            this.props.onPress(this.props.data)
        }
    }

    render() {
        return (
            <TouchableOpacity style={this.props.style} activeOpacity={0.7} onPress={this._onPress} >
                <View style={{
                    height: 160,
                    width: WINDOW_WIDTH - 16 * 2,
                    borderRadius: 8,
                    backgroundColor: 'black'
                }}>
                    <Image style={{
                        height: 160,
                        width: WINDOW_WIDTH - 16 * 2,
                        borderRadius: 8
                        }} source={{uri: this.props.thumbnail}} />
                    <LinearGradient style={{
                        position: 'absolute',
                        bottom: 0,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        width: '100%',
                        height: 50
                    }} colors={['#00000000', '#000']}>
                        <Text style={{
                            color: 'white',
                            fontSize: 13,
                            position: 'absolute',
                            bottom: 0,
                            marginLeft: 8,
                            marginBottom: 8
                        }}>{this.props.name}</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        )
    }
}