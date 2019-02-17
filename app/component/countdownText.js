import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import string from '../res/string'

export default class CountdownText extends Component {

    isComponentWillUnmount = true
    isDone = true
    intervalID = null

    startTime = 0
    endTime = 0

    constructor(props) {
        super(props)

        this.startTime = this.props.startTime ? this.props.startTime : 0
        this.endTime = this.props.endTime ? this.props.endTime : 0
        this.state = {
            count: this.endTime - this.startTime
        }
    }

    componentDidMount() {
        this.isDone = false
        this.isComponentWillUnmount = false
        this._countdownTask()
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
        this.isComponentWillUnmount = true
    }

    _countdownTask = () => {
        this.intervalID = setInterval(() => {
            if (this.isComponentWillUnmount == false || this.isDone == false) {
                const newCountValue = this.state.count - 1
                if (newCountValue >= 0) {
                    this.setState({ count: newCountValue })
                }
                else {
                    clearInterval(this.intervalID)
                    this.isDone = true
                }
            }
        }, 1000)
    }

    _formatDateTime(second) {
        second = Math.floor(second)
        if (second < MINUTE_COUNT) {
            return second + 's'
        }
        else if (second < HOUR_COUNT) {
            const minutes = Math.floor(second / MINUTE_COUNT)
            const seconds = (second % 60)
            return minutes + ':' + seconds
        }
        else if (second < DAY_COUNT) {
            const hours = Math.floor(second / HOUR_COUNT)
            const minutes = Math.floor((second / MINUTE_COUNT) % MINUTE_COUNT)
            const seconds = (second % 60)
            return hours + ':' + minutes + ':' + seconds
        }
        else {
            const days = Math.floor(second / DAY_COUNT)
            const hours = Math.floor(second / HOUR_COUNT / 24)
            const minutes = Math.floor((second / MINUTE_COUNT) % MINUTE_COUNT)
            const seconds = (second % 60)

            if (days > 1) {
                return days + ' ' + string.days + ' ' + this._inFormat(hours) + ':' + this._inFormat(minutes) + ':' + this._inFormat(seconds)   
            }
            else {
                return days + ' ' + string.day + ' ' + this._inFormat(hours) + ':' + this._inFormat(minutes) + ':' + this._inFormat(seconds)    
            }
        }
    }

    _inFormat(input) {
        if (input < 10) {
            return "0" + input
        }

        return input
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text {...this.props} style={[{...this.props.style}, { fontWeight: 'normal' }]}>{string.remaining}</Text>
                <Text {...this.props} style={[{...this.props.style}, { marginLeft: 8 }]}>{this._formatDateTime(this.state.count)}</Text>    
            </View>
        )
    }
}