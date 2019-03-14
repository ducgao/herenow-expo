import React, {Component} from 'react'
import {
  StyleSheet, 
  Text, 
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import string from '../res/string'
import { theme } from '../res/theme'
import HNButton from '../component/hnButton'
import DataRepository from '../repository/data-repository'
import Category from '../component/category'

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

  _onCategoryClick = (category) => {
    const onFeedback = this.props.navigation.getParam("onFeedback")
    if (onFeedback) {
      onFeedback(category)
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

  _getIndexOfCategory(category) {
    switch(category.name) {
      case "Hotel": {
        return 5
      }
      case "Food & Beverage": {
        return 3
      }
      case "Local Event": {
        return 2
      }
      case "Service": {
        return 6
      }
      case "Shop": {
        return 4
      }
      case "Tour": {
        return 1
      }
      default: {
        return 7
      }
    }
  }

  _renderCategories() {
    const categories = this.dataRepository.getCategories().sort((a, b) => {
      let indexA = this._getIndexOfCategory(a)
      let indexB = this._getIndexOfCategory(b)

      return indexA - indexB
    }).map((category) => 
      <Category 
        style={{ marginRight: 16, marginBottom: 16 }} 
        key={category.id} 
        data={category}
        name={category.name}
        thumbnail={category.coverUrl}
        onPress={this._onCategoryClick}
         />
    )

    const wrapCategories = []
    for (let index = 0; index < categories.length; index += 2) {
      const aRow = <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        {categories[index]}
        {index + 1 < categories.length ? categories[index + 1] : null}
      </View>
      wrapCategories.push(aRow)
    }

    const content = this.dataRepository.getCategories().length == 0 ?
      <ActivityIndicator style={{ marginLeft: 16, alignSelf: 'flex-start' }} /> 
      :
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ marginLeft: 16 }}>
          {wrapCategories}
        </View>
      </ScrollView>
    return (
      <View style={{
        flex: 1,
        paddingTop: 12,
        width: WINDOW_WIDTH
      }}>
        {content}
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <Text style={{
          marginTop: 44,
          marginLeft: 16,
          fontSize: 24,
          fontWeight: 'bold'
        }}>{string.categories}</Text>
        {this._renderCategories()}
        {this._renderCloseButton()}
        <HNButton 
          style={{ 
            width: WINDOW_WIDTH - 32, 
            marginTop: 12, 
            marginBottom: 16,
            marginLeft: 16
          }} 
          text={"Clear filter"} 
          onPress={() => this._onCategoryClick(null)} />
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
