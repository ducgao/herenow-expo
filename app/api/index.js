import UserRepository from "../repository/user-repository";

const HOST = "http://api-stg.herenow.co"

const endpoints = {
    categories: HOST + "/categories",
    authentication: HOST + "/authentication",
    featured: HOST + "/featured-deals?locationId=",
    address: HOST + "/addresses",
    customers: HOST + "/customers",
    wallet: HOST + "/orders?$sort[createdAt]=-1&status=paid&dealUsage=unused",
    gallery: HOST + "/photos?$limit=false&galleryId=",
    deals: HOST + "/deals",
    locations: HOST + "/locations",
    nearby: HOST + "/deal-locator?radius=10&",
    merchants: HOST + "/providers",
    featuredProvider: HOST + "/featured-providers?locationId=",
    post: HOST + "/posts?$sort[createdAt]=-1&type=",
    comment: HOST + "/fcomments?postId=",
    postComment: HOST + "/fcomments",
    resetPass: HOST + "/authmanagement",
    uploadImages: HOST + "/imageUploads",
    savedPosts: HOST + "/saved-posts",
    createPost: HOST + "/posts",
    postDetail: HOST + "/posts?id=",
    saveProvider: HOST + "/favorite-providers",
    savedProviders: HOST + "/favorite-providers"
}

export default class Api {
  static _instance = null
  static instance() {
      if (this._instance == null) {
          this._instance = new Api()
      }
      
      return this._instance
  }

  _accessToken = null
  _location = null

  setAccessToken(token) {
      this._accessToken = token
  }

  setCurrentLocation(location) {
      this._location = location
  }

  _callPost(url, withAccessToken, body) {
    var headers = withAccessToken ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._accessToken,
    } : {
      'Content-Type': 'application/json'
    }

    if (this._accessToken == null) {
      headers = { 'Content-Type': 'application/json' }
    }

    return new Promise((resolve, rejecter) => {
      fetch(url, {
          method: 'POST',
          headers,
          body
      })
      .then(response => response.json())
      .then(responseJson => {
          resolve(responseJson)
      })
      .catch(e => {
          rejecter(e)
      })
    })
  }

  _callGet(url, withAccessToken) {
    var headers = withAccessToken ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._accessToken,
    } : {
      'Content-Type': 'application/json'
    }

    if (this._accessToken == null) {
      headers = { 'Content-Type': 'application/json' }
    }

    return new Promise((resolve, rejecter) => {
      fetch(url, {
        method: 'GET',
        headers
      })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson)
      })
      .catch(e => {
        rejecter(e)
      })
    })
  }

  signIn(email, password) {
    const body = JSON.stringify({
      email: 'customer_' + email,
      password,
      strategy: "local"
    })
    return this._callPost(endpoints.authentication, false, body)
  }

  getUserInfo() {
    return this._callGet(endpoints.customers, true)
  }

  signUp(firstName, lastName, email, password) {
    const body = JSON.stringify({
      email, 
      password,
      firstName,
      lastName,
    })
    return this._callPost(endpoints.customers, false, body)
  }

  getGallery(id) {
    return this._callGet(endpoints.gallery + id, false)
  }

  getDeals() {
    return new Promise((resolve, rejecter) => {
      setTimeout(() => {
          resolve(recentsDumpData)
      }, 2000)
    })
  }

  getCategories() {
    return this._callGet(endpoints.categories, false)
  }

  getNearby(location) {
    const url = endpoints.nearby + "&centerLat=" + location.latitude + "&centerLng=" + location.longitude
    return this._callGet(url, false)
  }

  getWallet() {
    return this._callGet(endpoints.wallet, true)
  }

  getFeaturedProviders() {
    const url = endpoints.featuredProvider + this._location.id
    return this._callGet(url, true)
  }

  getAddressInfo(id) {
    const url = endpoints.address + "/" + id
    return this._callGet(url, false)
  }

  getMerchant(id) {
    const url = endpoints.merchants + "/" + id
    return this._callGet(url, true)
  }

  searchWith(data, page = 0) {
    var url = endpoints.deals + "?$limit=5&$skip=" + page * 5
    data.forEach(d => {
        url += d.name + "=" + d.value + "&"
    })

    return this._callGet(url, false)
  }

  getDeals() {
    return this._callGet(endpoints.deals, false)
  }

  getLocations() {
    return this._callGet(endpoints.locations, false)
  }

  getMerchants() {
    return this._callGet(endpoints.merchants, false)
  }

  getNearLocation(location) {
    const url = endpoints.locations + "?latitude=" + location.latitude + "&longitude=" + location.longitude
    return this._callGet(url, false)
  }

  getPosts(type, page = 0) {
    const url = endpoints.post + type + "&city=" + this._location.city + "&$limit=10&$skip=" + page * 10 
    return this._callGet(url, true)
  }

  getPostComment(id, page = 0) {
    const url = endpoints.comment + id + "&$limit=5&$skip=" + page * 5
    return this._callGet(url, false)
  }

  postComment(id, comment) {
    const body = JSON.stringify({
      content: comment,
      postId: id
    })
    return this._callPost(endpoints.postComment, true, body)
  }

  editProfile(changes) {
    const userId = UserRepository.instance().getUserData().id
    return new Promise((resolve, rejecter) => {
      fetch(endpoints.customers + "/" + userId, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this._accessToken,
        },
        body: JSON.stringify(changes)
      })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson)
      })
      .catch(e => {
        rejecter(e)
      })
    })
  }

  getResetCode(email) {
    const body = JSON.stringify({
      action: "sendResetPwd",
      value: {
        email: 'customer_' + email
      }
    })
    return this._callPost(endpoints.resetPass, false, body)
  }

  uploadImage(image) {
    const body = new FormData()
    body.append('uri', image)
    return new Promise((resolve, rejecter) => {
      fetch(endpoints.uploadImages, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + this._accessToken
          },
          body
      })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson)
      })
      .catch(e => {
        rejecter(e)
      })
    }) 
  }

  savePost(id) {
    const body = JSON.stringify({
      postId: id
    })
    return this._callPost(endpoints.savedPosts, true, body)
  }

  getSavedPosts() {
    return this._callGet(endpoints.savedPosts, true)
  }

  createPost(type, title, content, images) {
    const body = JSON.stringify({
      title,
      content,
      type,
      city: this._location.city,
      countryCode: "VN",
      coverUrl: images[0].url,
      media: images
    })
    return this._callPost(endpoints.createPost, true, body)
  }

  getPost(id) {
    const url = endpoints.postDetail + id
    return this._callGet(url, true)
  }

  saveProvider(id) {
    const body = JSON.stringify({
      providerId: id
    })
    return this._callPost(endpoints.saveProvider, true, body)
  }

  getSavedProviders() {
    return this._callGet(endpoints.savedProviders, true)
  }
}