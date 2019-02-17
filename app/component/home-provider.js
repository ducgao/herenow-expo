import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo'
import { theme } from '../res/theme'

export default class Category extends Component {
    _onPress = () => {
        if (this.props.onPress) {
            this.props.onPress(this.props.data)
        }
    }

    render() {
        const data = this.props.data.provider
        const imageSource = data.coverPhotoUrl ? {uri: data.coverPhotoUrl} : null
        return (
            <TouchableOpacity style={this.props.style} activeOpacity={0.7} onPress={this._onPress}>
                <View style={{
                    width: 200
                }}>
                    <Image style={{
                        height: 140,
                        width: 200,
                        borderRadius: 8,
                        backgroundColor: theme().image_background
                        }} source={imageSource} />
                    <LinearGradient style={{
                        position: 'absolute',
                        bottom: 0,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        width: '100%',
                        height: 50
                    }} colors={['#00000000', '#000']}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={{
                            fontSize: 14,
                            color: 'white',
                            fontWeight: 'bold',
                            width: 200 - 16,
                            left: 8,
                            position: 'absolute',
                            bottom: 4,
                        }}>{data.name}</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        )
    }
}