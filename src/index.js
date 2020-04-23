const fetch = require('node-fetch')
const user = require('./models/user')

module.exports = class {
  constructor ({
    username,
    password,
    url = 'https://api.getcloudcherry.com/api'
  }) {
    this.username = username
    this.password = password
    const basic = Buffer.from(username + ":" + password).toString('base64')
    this.authString = 'Basic ' + basic
    this.authHeader = {
      'Authorization': this.authString
    }
    this.url = url
  }

  // create a new user
  async createUser ({
    name,
    username,
    email,
    // mobilePhone is an optional field
    mobilePhone,
    password
  }) {
    // request URL
    const url = this.url + '/account/register/SubUser'
    // POST body
    const body = user({
      name,
      username,
      email,
      mobilePhone,
      password
    })
    // request options
    const options = {
      headers: {
        'Authorization': this.authString,
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
    // request URL
    const url = this.url + '/account/getsubusers'
    // POST body
    const options = {
      headers: this.authHeader
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
