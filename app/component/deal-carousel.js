import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import string from '../res/string'
import { formatDateTime } from '../utils'
import DataRepository from '../repository/data-repository'
import Category from './category'
import { theme } from '../res/theme'
import { LinearGradient } from 'expo'

const WINDOW_WIDTH = Dimensions.get('window').width
export default class DealCarousel extends Component {

    isComponentWillUnmount = true
    intervalID = null

    state = {
        remainingTime: string.calculating,
        isDone: false
    }

    componentWillMount() {
        this._initCounter(this.props.data)
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
        const data = this.props.data
        const imageSource = data.coverPhotoUrl ? {uri: data.coverPhotoUrl} : null
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._onPress(data)}>
                <Image style={{ 
                    width: itemWidth, 
                    height: 150, 
                    borderRadius: 8, 
                    backgroundColor: 'black' 
                }} 
                source={imageSource} resizeMode='cover' />
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
                    fontWeight: 'bold',
                    fontSize: 13,
                    position: 'absolute',
                    bottom: 0,
                    marginLeft: 8,
                    marginBottom: 25
                }}>{data.name}</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 8 }}>
                    <Text style={{
                        fontSize: 14,
                        marginTop: 8,
                        marginLeft: 8,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>{data.price / 1000 + " VNĐ / "}</Text>
                    <Text style={{
                        fontSize: 14,
                        marginTop: 8,
                        fontWeight: 'bold',
                        color: 'red'
                    }}>{this.state.isDone ? string.ended : formatDateTime(this.state.remainingTime)}</Text>
                </View>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

const { width: viewportWidth } = Dimensions.get('window')
const itemWidth = viewportWidth / 2