import React, {Component} from 'react'
import {
  StyleSheet, 
  Text, 
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import FlowLayout from '../component/flowlayout'
import Icon from 'react-native-vector-icons/FontAwesome'
import string from '../res/string'
import { theme } from '../res/theme'
import HNButton from '../component/hnButton'
import DataRepository from '../repository/data-repository'

export default class Favorite extends Component {
  static navigationOptions = { header: null }

  dataRepository = DataRepository.instance()

  componentDidMount() {
    const selectedCategory = this.props.navigation.getParam("category")
    if (this.categoriesFilterComponent && selectedCategory) {
      this.categoriesFilterComponent.setSelected(selectedCategory.name)
    }
  }

  _onBack = () => {
    this.props.navigation.goBack()
  }

  _resetFilter = () => {
    if (this.categoriesFilterComponent) {
      this.categoriesFilterComponent.resetData()
    }
  }

  _apply = () => {
    const index = this.categoriesFilterComponent.getSelectedPosition()
    const selectedCategory = this.dataRepository.getCategories()[index]
    const onFeedback = this.props.navigation.getParam("onFeedback")
    if (onFeedback) {
      onFeedback(selectedCategory)
    }
    this.props.navigation.goBack()
  }

  _renderCloseButton() {
    return (
      <TouchableOpacity style={{
        position: 'absolute',
        top: 44,
        right: 16,
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
      }} onPress={this._onBack} activeOpacity={0.7} key={"deal-detail-close"}>
        <Icon style={{
          justifyContent: 'center', 
          alignItems: 'center',  
          alignContent: 'center',
          alignSelf: 'center',
          textAlign: 'center'
        }} name='close' size={15} color={theme().inactive_color} />
      </TouchableOpacity>
    )
  }

  _renderCTA() {
    const buttonWidth = (WINDOW_WIDTH - 16 * 2) / 2 - 8
    const reset = <HNButton 
      key='filter-reset-button' 
      style={{ width: buttonWidth, marginRight: 16, backgroundColor: 'white' }} 
      textColor='black' 
      text={string.reset}
      onPress={this._resetFilter} />
    const apply = <HNButton 
      key='filter-appy-button' 
      style={{ width: buttonWidth }} 
      text={string.search} 
      onPress={this._apply} />

    return (
      <View style={{ 
        flexDirection: 'row', 
        paddingLeft: 16, 
        paddingRight: 16,
        position: 'absolute',
        bottom: 16
      }} > 
        {[reset, apply]}
      </View>
    )
  }

  render() {
    const categoriesFilterData = this.dataRepository.getCategories().map((category) => 
      category.name
    )
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <Text style={{
          marginTop: 80,
          marginLeft: 16,
          fontSize: 20,
          fontWeight: 'bold'
        }}>{string.categories}</Text>
        <FlowLayout
          ref={ref => this.categoriesFilterComponent = ref}
          style={{
            paddingLeft: 16,
            paddingRight: 16
          }}
          multiselect={false}
          dataValue={categoriesFilterData}
        />
        {this._renderCloseButton()}
        {this._renderCTA()}
      </View>
    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
