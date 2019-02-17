import UserRepository from "../repository/user-repository";

const HOST = "http://api-stg.herenow.co"

const endpoints = {
    categories: HOST + "/categories",
    authentication: HOST + "/authentication",
    featured: HOST + "/featured-deals?locationId=",
    address: HOST + "/addresses",
    customers: HOST + "/customers",
    wallet: HOST + "/customers?from_mobile=true",
    gallery: HOST + "/photos?$limit=false&galleryId=",
    deals: HOST + "/deals",
    locations: HOST + "/locations",
    nearby: HOST + "/deal-locator?radius=10&",
    merchants: HOST + "/providers",
    featuredProvider: HOST + "/featured-providers?locationId=",
    post: HOST + "/posts?type=",
    comment: HOST + "/fcomments?postId=",
    postComment: HOST + "/fcomments",
    resetPass: HOST + "/authmanagement",
    uploadImages: HOST + "/imageUploads",
    savedPosts: HOST + "/saved-posts"
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

    signIn(email, password) {
      return new Promise((resolve, rejecter) => {
        fetch(endpoints.authentication, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'customer_' + email,
            password,
            strategy: "local"
          })
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

    getUserInfo() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.customers, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this._accessToken,
                }
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

    signUp(firstName, lastName, email, password) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.customers, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, 
                    password,
                    firstName,
	                lastName,
                })
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

    getGallery(id) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.gallery + id)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
        })
    }

    getDeals() {
        return new Promise((resolve, rejecter) => {
            setTimeout(() => {
                resolve(recentsDumpData)
            }, 2000)
        })
    }

    getCategories() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.categories)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getNearby(location) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.nearby + "&centerLat=" + location.latitude + "&centerLng=" + location.longitude)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getWallet() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.wallet, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this._accessToken,
                }
            })
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => {
                alert(e)
                rejecter(e)
            })
        })
    }

    getFeaturedProviders() {
        const url = endpoints.featuredProvider + this._location.id
        return new Promise((resolve, rejecter) => {
            fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getAddressInfo(id) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.address + "/" + id)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getMerchant(id) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.merchants + "/" + id) 
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    searchWith(data, page = 0) {
        var url = endpoints.deals + "?$limit=5&$skip=" + page * 5
        data.forEach(d => {
            url += d.name + "=" + d.value + "&"
        })
        return new Promise((resolve, rejecter) => {
            fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getDeals() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.deals)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getLocations() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.locations)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getMerchants() {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.merchants)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getNearLocation(location) {
        const url = endpoints.locations + "?latitude=" + location.latitude + "&longitude=" + location.longitude
        return new Promise((resolve, rejecter) => {
            fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getPost(type, page = 0) {
        const url = endpoints.post + type + "&city=" + this._location.city + "&$limit=5&$skip=" + page * 5 
        return new Promise((resolve, rejecter) => {
            fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    getPostComment(id, page = 0) {
        const url = endpoints.comment + id + "&$limit=5&$skip=" + page * 5
        return new Promise((resolve, rejecter) => {
            fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson)
            })
            .catch(e => rejecter(e))
        })
    }

    postComment(id, comment) {
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.postComment, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this._accessToken,
                },
                body: JSON.stringify({
                    content: comment,
                    postId: id
                })
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
        return new Promise((resolve, rejecter) => {
            fetch(endpoints.resetPass, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: "sendResetPwd",
                    value: {
                      email: 'customer_' + email
                    }
                })
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
      return new Promise((resolve, rejecter) => {
          fetch(endpoints.savedPosts, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this._accessToken,
              },
              body: JSON.stringify({
                  postId: id
              })
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

    getSavedPosts() {
      return new Promise((resolve, rejecter) => {
        fetch(endpoints.savedPosts, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this._accessToken,
            }
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
}