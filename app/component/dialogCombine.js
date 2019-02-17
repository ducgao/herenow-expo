import React, {Component} from 'react'
import {
  View,
  Modal,
  Image,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import { theme } from '../res/theme'

export const SHOW_LOADING = "SHOW_LOADING"
export const SHOW_DEAL_CODE = "SHOW_DEAL_CODE"

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height
export class DialogCombine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.showTag != null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.showTag != null
        })
    }

    _renderLoading() {
        return (
            <View style={{
                backgroundColor: 'white', 
                borderRadius: 10,
                width: 200,
                height: 130,
                alignSelf: 'center',
                justifyContent: 'center'
            }}>
                <Image style={{
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    width: "90%",
                    height: "90%"
                }} source={require('../res/images/herenow-loading.gif')} />
            </View>
        )
    }

    _renderDealCode() {
        return (
            <View style={{
                width: WINDOW_WIDTH - 100,
                alignSelf: 'center',
                justifyContent: 'center'
            }}>
                <View style={{
                    width: '100%',
                    height: 100,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    backgroundColor: theme().primary_color,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 28,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>COUPONCODE</Text>
                </View>
                <View style={{
                    width: '100%',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 16,
                    paddingRight: 16,
                    backgroundColor: 'white',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        width: '100%',
                        color: theme().primary_color,
                        fontSize: 14
                    }}>You can use this code for every market you meet on the way you go. Just show it up!</Text>
                </View>
            </View>
        )
    }

    _renderContent = () => {
        switch(this.props.showTag) {
            case SHOW_LOADING: return this._renderLoading()
            case SHOW_DEAL_CODE: return this._renderDealCode()
        }
    }
    
    _requestClose = () => {
        if (this.props.touchOutsideToDismiss) {
            this.setState({ visible: false })
        }
    }

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={() => {}}
                visible={this.state.visible}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center', 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }} >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={{
                            position: 'absolute',
                            width: WINDOW_WIDTH,
                            height: WINDOW_HEIGHT
                        }} 
                        onPress={this._requestClose}/>
                    {this._renderContent()}
                </View>
            </Modal>
        )
    }
}