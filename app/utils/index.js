import { Dimensions, Platform, AsyncStorage } from 'react-native'
import string from '../res/string'

export function isValidEmail(input) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return reg.test(input)
}

export const isIphoneX = () => {
  const { height, width } = Dimensions.get('window')
  return (Platform.OS === 'ios' && (height === 812 || width === 812))
}

export const DAY_COUNT = 3600 * 24
export const HOUR_COUNT = 3600
export const MINUTE_COUNT = 60
export function formatDateTime(second) {
  second = Math.floor(second)
  if (second < MINUTE_COUNT) {
      return inFormat(second) + 's'
  }
  else if (second < HOUR_COUNT) {
      const minutes = Math.floor(second / MINUTE_COUNT)
      const seconds = (second % 60)
      return '00:' + inFormat(minutes) + ':' + inFormat(seconds)
  }
  else if (second < DAY_COUNT) {
      const hours = Math.floor(second / HOUR_COUNT)
      const minutes = Math.floor((second / MINUTE_COUNT) % MINUTE_COUNT)
      const seconds = (second % 60)
      return inFormat(hours) + ':' + inFormat(minutes) + ':' + inFormat(seconds)
  }
  else {
      const days = Math.floor(second / DAY_COUNT)
      const hours = Math.floor(second / HOUR_COUNT / 24)
      const minutes = Math.floor((second / MINUTE_COUNT) % MINUTE_COUNT)
      const seconds = (second % 60)

      if (days > 1) {
          return days + ' ' + string.days + ' ' + inFormat(hours) + ':' + inFormat(minutes) + ':' + inFormat(seconds)   
      }
      else {
          return days + ' ' + string.day + ' ' + inFormat(hours) + ':' + inFormat(minutes) + ':' + inFormat(seconds)    
      }
  }
}

export function inFormat(input) {
  if (input < 10) {
      return "0" + input
  }

  return input
}

export const DARK_THEME_ENABLE_KEY = "DARK_THEME_ENABLE"
export function setDarkTheme(enable) {
    AsyncStorage.setItem(DARK_THEME_ENABLE_KEY, enable)
}