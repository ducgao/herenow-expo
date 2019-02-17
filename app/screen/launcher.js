/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Image, StyleSheet, View} from 'react-native';

export default class Launcher extends Component {
  static navigationOptions = { header: null }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.replace('Main')
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ 
          alignSelf: 'center',
          resizeMode: 'contain',
          width: "50%",
          height: "50%"
        }} source={require('../res/images/herenow-loading.gif')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});
