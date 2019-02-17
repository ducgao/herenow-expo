import React from 'react'
import { 
  View,
  Easing,
  Animated,
  Platform
} from 'react-native'
import { createStackNavigator } from 'react-navigation'
import Launcher from './screen/launcher'
import Main from './screen/main'
import Auth from './screen/auth'
import EditProfile from './screen/edit-profile'
import DealDetail from './screen/deal-detail'
import PostDetail from './screen/post-detail'
import PostCreator from './screen/post-creator'
import ProviderDetail from './screen/provider-detail'
import Filter from './screen/filter'
import Locations from './screen/locations'
import PhotoGallery from './screen/photo-gallery'
import CartCredit from './screen/cart-credit'
import Search from './screen/search'
import Favorite from './screen/favorite'
import ForgotPassword from './screen/forgot-password'
import DataRepository from './repository/data-repository'

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 700,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {      
      const { position, scene } = sceneProps
      const thisSceneIndex = scene.index

      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1],
      })

      return { opacity } 
    }
  }
}

const androidScreensDefination = {
  Launcher: { screen: Launcher},
  Main: { screen: Main},
  Auth: { screen: Auth},
  Favorite: { screen: Favorite},
  ForgotPassword: { screen: ForgotPassword },
  EditProfile: { screen: EditProfile },
  PostCreator: { screen: PostCreator },
  Search: { screen: Search },
  DealDetail: { screen: DealDetail },
  PostDetail: { screen: PostDetail },
  ProviderDetail: { screen: ProviderDetail },
  Filter: { screen: Filter },
  PhotoGallery: { screen: PhotoGallery},
  CartCredit: { screen: CartCredit},
  Locations: { screen: Locations }
}

const iosScreensDefination = {
  Main: { screen: Main},
  Auth: { screen: Auth},
  Favorite: { screen: Favorite},
  ForgotPassword: { screen: ForgotPassword },
  EditProfile: { screen: EditProfile },
  PostCreator: { screen: PostCreator },
  Search: { screen: Search },
  DealDetail: { screen: DealDetail },
  PostDetail: { screen: PostDetail },
  ProviderDetail: { screen: ProviderDetail },
  Filter: { screen: Filter },
  PhotoGallery: { screen: PhotoGallery},
  CartCredit: { screen: CartCredit},
  Locations: { screen: Locations }
}

const iosNavigationOptions = {
  transitionConfig, 
  navigationOptions: {
      gesturesEnabled: false
  } 
}

const androidNavigationOptions = { 
  navigationOptions: {
      gesturesEnabled: false
  } 
}

const screensDefination = Platform.OS == 'ios' ? iosScreensDefination : androidScreensDefination
const navigationOptions = Platform.OS == 'ios' ? iosNavigationOptions : androidNavigationOptions

const TheNavigator = createStackNavigator(screensDefination, navigationOptions)

export default class App extends React.Component {
  constructor(props) {
    super(props)

    console.disableYellowBox = true
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TheNavigator onNavigationStateChange={(currentState) => {
          DataRepository.instance().setCurrentRoute(currentState)
        }} />
      </View>
    )
  }
}