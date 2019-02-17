export default class DataRepository {
    static _instance = null
    static instance() {
        if (this._instance == null) {
            this._instance = new DataRepository()
        }
        
        return this._instance
    }

    _currentRoute = null
    _categories = []
    _deals = []
    _wallet = []
    _nearby = []
    _featuredDeals = []
    _locations = []

    reset() {
        this._currentRoute = null
        this._categories = []
        this._deals = []
        this._wallet = []
        this._nearby = []
        this._featuredDeals = []
        this._locations = []
    }

    setCurrentRoute(route) {
        this._currentRoute = route
    }

    setCategories(categories) {
        this._categories = categories
    }

    setDeals(deals) {
        this._deals = deals
    }

    setWallet(wallet) {
        this._wallet = wallet
    }

    setNearby(nearby) {
        this._nearby = nearby
    }

    setLocations(locations) {
        this._locations = locations
    }

    getCurrentRoute() {
        return this._currentRoute
    }

    getDeals() {
        return this._deals
    }

    getCategories() {
        return this._categories
    }

    getWallet() {
        return this._wallet
    }

    getNearby() {
        return this._nearby
    }

    getLocations() {
        return this._locations
    }
}