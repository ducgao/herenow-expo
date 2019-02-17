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

const WINDOW_WIDTH = Dimensions.get('window').width
export default class DealList extends Component {

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

    _getColor(category) {
        if (category) {
            switch (category.name) {
                case 'Tours': return '#00afff'
                case 'Local Event': return '#ffaf19'
                case 'Food & Beverage': return '#ff6419'
                case 'Hotels': return '#c84b96'
                default: return theme().primary_color
            }
        }

        return theme().primary_color
    }

    render() {
        const data = this.props.data
        const categories = DataRepository.instance().getCategories()
        const dealCategory = categories.find(d => d.id == data.categoryId)

        const imageSource = data.coverPhotoUrl ? {uri: data.coverPhotoUrl} : null
        const color = this._getColor(dealCategory)
        return (
            <TouchableOpacity style={[
                this.props.style, 
                { 
                    width: WINDOW_WIDTH - 16 * 2, 
                    flexDirection: 'row', 
                    backgroundColor: 'white',
                    borderRadius: 8,
                    elevation: 4,
                    overflow: 'hidden'
                }
            ]} activeOpacity={0.7} onPress={this._onPress} >
                <Image
                    style={{
                        position: 'absolute',
                        tintColor: color,
                        top: -2,
                        right: -2,
                        width: 50,
                        height: 50
                    }}
                    source={require('../res/images/sign.png')}
                />
                <Image style={{
                    height: '100%',
                    width: 160,
                    backgroundColor: 'black',
                    borderRadius: 8,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0
                }} source={imageSource} />
                <View style={{ marginLeft: 8, width: WINDOW_WIDTH - 160 - 8 - 16 }}>
                    <Text style={{
                        fontSize: 20,
                        marginTop: 8,
                        marginRight: 54,
                        color: theme().primary_color
                    }}>{data.name}</Text>
                    <Text style={{
                        fontSize: 12,
                        marginRight: 30,
                        color: theme().primary_color
                    }}>{data.shortDesc}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: 12,
                            marginTop: 10,
                            color: theme().primary_color
                        }}>{string.remaining + ": "}</Text>
                        <Text style={{
                            fontSize: 14,
                            marginTop: 8,
                            fontWeight: 'bold',
                            color: 'red'
                        }}>{this.state.isDone ? string.ended : formatDateTime(this.state.remainingTime)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <Text style={{
                            fontSize: 12,
                            color: theme().primary_color,
                            marginTop: 3
                        }}>{string.price + ": "}</Text>
                        <Text style={{
                            fontSize: 14,
                            marginTop: 1,
                            marginLeft: 2,
                            color: theme().primary_color,
                            fontWeight: 'bold'
                        }}>{data.price.formatMoney() + ' VNĐ'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}