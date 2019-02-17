import React, {Component} from 'react'
import {
  View, 
  Image,
  Text,
  Dimensions
} from 'react-native'
import UserRepository from '../repository/user-repository';
import { theme } from '../res/theme';


const WINDOW_WIDTH = Dimensions.get('window').width
export default class Comment extends Component {

    render() {
        const data = this.props.data
        const userData = UserRepository.instance().getUserData()
        const userDisplayValue = data.user ? data.user.displayName : (userData.firstName + userData.lastName) 
        const imageSource = data.photoUrl ? {uri: data.photoUrl} : null
        return (
            <View style={{
                marginLeft: 16,
                marginRight: 16,
                marginTop: 12,
                flexDirection: 'row'
            }}>
                <Image style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: theme().image_background
                }} source={imageSource}></Image>
                <View style={{
                    width: WINDOW_WIDTH - 16 * 2 - 8 - 50,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    marginLeft: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4
                }}>
                    <Text style={{
                        fontSize: 11,
                        fontWeight: 'bold'
                    }}>{userDisplayValue}</Text>
                    <Text style={{
                        fontSize: 13
                    }}>{data.content}</Text>
                </View>
                
            </View>
        )
    }
}