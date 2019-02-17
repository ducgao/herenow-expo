import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import string from '../res/string'
import { formatDateTime } from '../utils'

export default class Category extends Component {

    isComponentWillUnmount = true
    intervalID = null

    state = {
        remainingTime: string.calculating,
        isDone: false
    }

    componentWillMount() {
        this._initCounter(this.props.data.deal)
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalID)
        this.isComponentWillUnmount = true
    }

    _initCounter = (deal) => {
        const startTime = (new Date()).getTime() / 1000
        const stopTime = (new Date(deal.stopsAt)).getTime() / 1000
    
        this.setState({ 
          remainingTime: stopTime - startTime,
          isDone: (stopTime - startTime) < 1 ? true : false
        }, () => {
          this.isComponentWillUnmount = false
          this._countdownTask()
        })
    }

    _countdownTask = () => {
        this.intervalID = setInterval(() => {
            if (this.isComponentWillUnmount == false) {
                const newCountValue = this.state.remainingTime - 1
                if (newCountValue >= 0) {
                    this.setState({ remainingTime: newCountValue })
                }
                else {
                    clearInterval(this.intervalID)
                    this.setState({ isDone: true })
                }
            }
        }, 1000)
    }

    _onPress = () => {
        if (this.props.onPress) {
            this.props.onPress(this.props.data)
        }
    }

    render() {
        const data = this.props.data.deal
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
                        backgroundColor: 'black'
                        }} source={imageSource} />
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginTop: 8
                    }}>{data.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 4
                        }}>{string.remaining + ": "}</Text>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 4,
                            fontWeight: 'bold',
                            color: 'red'
                        }}>{this.state.isDone ? string.ended : formatDateTime(this.state.remainingTime)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 1
                        }}>{string.price + ": "}</Text>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 1,
                            marginLeft: 2,
                            fontWeight: 'bold'
                        }}>{data.price.formatMoney()}</Text>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 1,
                            marginLeft: 1
                        }}>{" (cent)"}</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        )
    }
}