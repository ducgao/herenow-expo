import { AsyncStorage } from 'react-native'
import Api from '../api'
import DataRepository from './data-repository'
import { DARK_THEME_ENABLE_KEY, setDarkTheme } from '../utils'

export const ACCESS_TOKEN_SAVE_KEY = "ACCESS_TOKEN_SAVE_KEY"
export const USER_INFO_SAVE_KEY = "USER_INFO_SAVE_KEY"
export const LOCATION_SAVE_KEY = "LOCATION_SAVE_KEY"

export default class UserRepository {
    static _instance = null
    static instance() {
        if (this._instance == null) {
            this._instance = new UserRepository()
        }
        
        return this._instance
    }
    
    _accessToken = null
    _userData = null
    _location = null
    _darkModeEnable = false

    /**
     * fresh everything after logout
     */
    logout = () => {
        this._accessToken = null
        this._userData = null
        this._location = null

        Api.instance().setAccessToken(null)
        DataRepository.instance().reset()
        AsyncStorage.removeItem(ACCESS_TOKEN_SAVE_KEY)
        AsyncStorage.removeItem(USER_INFO_SAVE_KEY)
        AsyncStorage.removeItem(LOCATION_SAVE_KEY)
        AsyncStorage.removeItem(DARK_THEME_ENABLE_KEY)
    }

    syncOfflineInfo = () => {
        AsyncStorage.getItem(ACCESS_TOKEN_SAVE_KEY).then(data => {
            this.setAccessToken(data)
        })

        AsyncStorage.getItem(USER_INFO_SAVE_KEY).then(data => {
            this._userData = JSON.parse(data)
        })

        AsyncStorage.getItem(DARK_THEME_ENABLE_KEY).then(data => {
            this._darkModeEnable = data ? true : false
        })
    }

    isLogged = () => {
        return this._accessToken != null
    }

    setAccessToken = (token) => {
        this._accessToken = token
        Api.instance().setAccessToken(token)
        AsyncStorage.setItem(ACCESS_TOKEN_SAVE_KEY, token)
    }

    setUserData = (userData) => {
        this._userData = userData
        AsyncStorage.setItem(USER_INFO_SAVE_KEY, JSON.stringify(userData))
    }

    setUserLocation = (location) => {
        this._location = location
    }

    setDarkModeEnable = (enable) => {
        this._darkModeEnable = enable
        if (enable) {
            setDarkTheme("1")
        }
        else {
            AsyncStorage.removeItem(DARK_THEME_ENABLE_KEY)
        }
    }

    getUserData = () => {
        return this._userData
    }

    getUserLocation = () => {
        return this._location
    }

    getDarkModeEnable = () => {
        return this._darkModeEnable
    }
}