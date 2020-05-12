const fetch = require('node-fetch')
const user = require('./models/user')

// make x-www-form-urlencoded data from json
function makeFormData (params) {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&')
}

module.exports = class {
  constructor ({
    username,
    password,
    url = 'https://api.getcloudcherry.com/api'
  }) {
    this.username = username
    this.password = password
    // const basic = Buffer.from(username + ":" + password).toString('base64')
    // this.authString = 'Basic ' + basic
    // this.authHeader = {
    //   'Authorization': this.authString
    // }
    this.url = url
  }

  async checkAccessToken () {
    if (this.accessToken) {
      // check that our access token is not expired
      try {
        const d = new Date(this.fullAccessToken['.expires'])
        const now = new Date()
        if (now < d) {
          // still valid - return now
          return
        } else {
          // expired - get new access token
        }
      } catch (e) {
        // invalid date - get new access token
      }
    } else {
      // no access token - get new access token
    }
    // get new access token
    await this.getAccessToken()
  }

  // create a new user
  async getAccessToken () {
    // request URL
    const url = this.url + '/LoginToken'
    // request options
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: makeFormData({
        grant_type: 'password',
        username: this.username,
        password: this.password
      })
    }
    try {
      // wait for the request to finish
      const response = await fetch(url, options)
      // parse JSON response
      const json = await response.json()
      // check response status
      if (response.ok) {
        // return JSON response
        // return json.access_token
        this.fullAccessToken = json
        this.accessToken = json.access_token
      } else {
        // status not OK
        throw Error(`${response.status} ${response.statusText} - ${json.message}`)
      }
    } catch (e) {
      // just rethrow any errors
      throw e
    }
  }
  
  // create a new user
  async createUser ({
    name,
    username,
    email,
    password,
    // the rest are optional fields
    mobilePhone,
    enterpriseRole,
    enterpriseRoleId,
    department,
    departmentId
  }) {
    // make sure we have a valid access token
    await this.checkAccessToken()
    // request URL
    const url = this.url + '/account/register/SubUser'
    // POST body
    const body = user({
      name,
      username,
      email,
      mobilePhone,
      password,
      enterpriseRole,
      enterpriseRoleId,
      department,
      departmentId
    })
    // request options
    const options = {
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(body)
    }
    try {
      // wait for the request to finish
      const response = await fetch(url, options)
      // parse JSON response
      const json = await response.json()
      // check response status
      if (response.ok) {
        // return JSON response
        return json
      } else {
        // status not OK
        throw Error(`${response.status} ${response.statusText} - ${json.message}`)
      }
    } catch (e) {
      // just rethrow any errors
      throw e
    }
  }
  
  // list all users
  async listUsers () {
    // make sure we have a valid access token
    await this.checkAccessToken()
    // request URL
    const url = this.url + '/account/getsubusers'
    // request options
    const options = {
      headers: {
        Authorization: 'Bearer ' + this.accessToken
      }
    }
    // start the request and return the promise
    try {
      // wait for the request to finish
      const response = await fetch(url, options)
      // parse JSON response
      const json = await response.json()
      // check response status
      if (response.ok) {
        // return JSON response
        return json
      } else {
        // status not OK
        throw Error(`${response.status} ${response.statusText} - ${json.message}`)
      }
    } catch (e) {
      // just rethrow any errors
      throw e
    }
  }
}
