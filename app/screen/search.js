import React, {Component} from 'react'
import {
  StyleSheet, 
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import SearchView from '../component/searchView'
import Category from '../component/category'
import Recent from '../component/recent'
import string from '../res/string'
import { isIphoneX } from '../utils'
import DataRepository from '../repository/data-repository'
import Api from '../api'
import { theme } from '../res/theme'
import DealList from '../component/deal-list'

export default class Search extends Component {
  static navigationOptions = { header: null }

  dataRepository = DataRepository.instance()
  api = Api.instance()

  searchView = null

  state = {
    categories: [],
    merchants: [],
    inSearchWithCategory: null,
    inSearchWithKeywords: null,
    inSearchWithMerchant: null,
    searchResults: null,
    searching: false,
    showUpdating: false
  }

  componentWillMount() {
    this.onDataReady()
  }

  onDataUpdating = () => {
    this.setState({ showUpdating: true })
  }

  onDataReady = () => {
    const newCategories = this.dataRepository.getCategories()
    // this._getMerchants()
    this.setState({ 
      categories: newCategories,
      searchResults: null,
      inSearchWithMerchant: null,
      inSearchWithCategory: null,
      inSearchWithKeywords: null
     })
  }

  _getSearchParams = (name, category, merchant) => {
    const searchParams = []
    if (name) {
      searchParams.push({name: "name[$like]", value: "%" + name + "%"})  
    }
    if (category) {
      searchParams.push({name: "categoryId", value: category.id})
    }
    if (merchant) {
      searchParams.push({name: "merchantId", value: merchant.id})
    }
    
    return searchParams
  }

  _getMerchants = () => {
    this.api.getMerchants().then(merchants => {
      this.setState({ merchants: merchants.data })
    })
  }

  _onDealClick = (deal) => {
    this.props.navigation.navigate("DealDetail", { deal: {deal} })
  }

  _onSearch = (keywords) => {
    if (keywords.trim() === "") {
      const category = this.state.inSearchWithCategory
      const merchant = this.state.inSearchWithMerchant
      if (merchant == null && category == null) {
        this.setState({ inSearchWithKeywords: null, searchResults: null })  
      }
      else {
        if (category) {
          this._onCategoryClick(category)
        }
        if (merchant) {
          this._onMerchantClick(merchant)
        }
      }
      return
    }

    this.setState({ searching: true }, () => {
      const searchParams = this._getSearchParams(keywords, this.state.inSearchWithCategory, this.state.inSearchWithMerchant)
      this.api.searchWith(searchParams)
      .then(res => 
        this.setState({ 
          searching: false,
          searchResults: res.data,
          inSearchWithKeywords: keywords
        })
      )
    })
  }

  _onMerchantClick = (merchant) => {
    this.setState({ searching: true }, () => {
      const searchParams = this._getSearchParams(null, null, merchant)
      this.api.searchWith(searchParams)
      .then(res => {
        this.searchView.reset()
        this.setState({ 
          searching: false,
          searchResults: res.data,
          inSearchWithCategory: null,
          inSearchWithKeywords: null,
          inSearchWithMerchant: merchant
        })
      })
    })
  }

  _onCategoryClick = (category) => {
    this.setState({ searching: true }, () => {
      const searchParams = this._getSearchParams(null, category, null)
      this.api.searchWith(searchParams)
      .then(res => {
        this.searchView.reset()
        this.setState({ 
          searching: false,
          searchResults: res.data,
          inSearchWithCategory: category,
          inSearchWithKeywords: null,
          inSearchWithMerchant: null
        })
      })
    })
  }

  _onFilterClick = () => {
    this.props.navigation.navigate("Filter", { category: this.state.inSearchWithCategory, onFeedback: this._onFeedback })
  }

  _onFeedback = (newCategory) => {
    /*
     * if newCategory is null and keywords is null too, call on data ready with search result = null
     * if newCategory is null and keywords is not null, call search with current keyword
     */
    if (newCategory) {
      this._onCategoryClick(newCategory)
      return
    }
    
    if (this.state.inSearchWithKeywords) {
      this.setState({
        inSearchWithCategory: null
      }, () => {
        this._onSearch(this.state.inSearchWithKeywords)
      })
    }
    else {
      this.onDataReady()
    }
  }

  _getSearchIndicator = () => {
    const keyword = this.state.inSearchWithKeywords
    const category = this.state.inSearchWithCategory
    const merchant = this.state.inSearchWithMerchant

    const displayValues = []
    if (category) {
      displayValues.push({ name: string.categories, value: category.name })
    }
    if (merchant) {
      displayValues.push({ name: string.merchants, value: merchant.name })
    }
    if (keyword) {
      displayValues.push({ name: string.keywords, value: keyword })
    }

    var searchIndicator = ""
    displayValues.forEach(d => {
      searchIndicator += d.name + ": " + d.value + " | "
    })

    if (displayValues.length == 0) {
      return ""
    }

    return searchIndicator.substring(0, searchIndicator.length - 3)
  }

  _renderSearchView() {
    const searchView = <SearchView 
      ref={ref => this.searchView = ref}
      key='search-view'
      style={styles.searchView} 
      onFilterClick={this._onFilterClick}
      onSearch={this._onSearch}
    />
    const searchIndicator = this._getSearchIndicator()
    const indicator = <Text key='search-indicator' style={{
      position: 'absolute',
      top: 88 + (isIphoneX() ? 12 : 0),
      left: 16,
      fontStyle: 'italic',
      fontSize: 13,
      color: theme().primary_color
    }}>{searchIndicator}</Text>
    const clear = <TouchableOpacity style={{
      position: 'absolute',
      top: 88 + (isIphoneX() ? 12 : 0),
      right: 16,
      paddingLeft: 8, 
      paddingRight: 8,
      backgroundColor: 'white',
      borderRadius: 8
    }} onPress={() => {
      this.searchView.reset()
      this.setState({ searching: false, searchResults: null, inSearchWithMerchant: null, inSearchWithCategory: null, inSearchWithKeywords: null })
    }}>
      <Text key='search-clear' style={{
        fontStyle: 'italic',
        fontSize: 13,
        color: theme().primary_color
      }}>clear</Text>
    </TouchableOpacity>
    if (searchIndicator == "") {
      return [searchView, indicator]
    }
    return [searchView, indicator, clear]
  }

  _renderCategories() {
    const categories = this.state.categories.map((category) => 
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

    const content = this.state.categories.length == 0 ?
      <ActivityIndicator style={{ marginLeft: 16, alignSelf: 'flex-start' }} /> 
      :
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ marginLeft: 16 }}>
          {wrapCategories}
        </View>
      </ScrollView>
    return (
      <View 
        style={{
          width: WINDOW_WIDTH
        }}
      >
        <Text style={{ 
          paddingLeft: 16, 
          fontSize: 24, 
          marginBottom: 12, 
          fontWeight: 'bold',
          color: theme().text_color
        }} >{string.categories}</Text>
        {content}
      </View>
    )
  }

  _renderMerchants() {
    if (this.state.merchants.length == 0) { return }

    const merchants = this.state.merchants.map((merchant) => 
      <Recent 
        style={{ marginLeft: 16, marginTop: 12 }} 
        key={merchant.id} 
        data={merchant}
        name={merchant.name}
        thumbnail={merchant.coverPhotoUrl}
        onPress={this._onMerchantClick}
         />
    )
    return (
      <View 
        style={{
          marginTop: 16,
          paddingBottom: 16,
          width: WINDOW_WIDTH
        }}
      >
        <Text style={{ paddingLeft: 16, fontSize: 24, fontWeight: 'bold' }} >{string.merchants}</Text>
        {merchants}
      </View>
    )
  }

  _renderContent() {
    if (this.state.searching == true) {
      return <Text style={{ 
        paddingLeft: 16, 
        fontSize: 20, 
        width: WINDOW_WIDTH,
        color: theme().text_color
      }} >{string.searching}</Text>
    }
    else {
      if (this.state.searchResults) {
        if (this.state.searchResults.length > 0) {
          const deals = this.state.searchResults.map((deal) => 
            <DealList 
              style={{ marginLeft: 8, marginRight: 8, marginTop: 12 }} 
              key={deal.id} 
              data={deal}
              onPress={this._onDealClick}
              />
          )

          return deals
        }
        else {
          return <Text style={{ 
            paddingLeft: 16, 
            marginTop: 8, 
            fontSize: 24, 
            width: WINDOW_WIDTH, 
            fontWeight: 'bold',
            color: theme().text_color
          }} >No Results</Text>
        }
      }
      else {
        return <View>
          {this._renderCategories()}
          {/* {this._renderMerchants()} */}
        </View> 
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: theme().app_background }]}>
        <ScrollView 
          style={{ marginTop: 110 + (isIphoneX() ? 12 : 0)}} 
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false} >
          {this._renderContent()}
        </ScrollView>
        {this._renderSearchView()}
      </View>
    )
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchView: {
    width: WINDOW_WIDTH - 16 * 2,
    position: 'absolute',
    top: 40 + (isIphoneX() ? 12 : 0)
  }
})
