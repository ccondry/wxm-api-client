# wxm-api-client
### Node.js library for Cisco Webex Experience Manager REST APIs

This library provides 2 methods currently - listUsers and createUser. 

## Example usage
```js
const lib = require('wxm-api-client')
// replace these values with your API username and password
const username = 'tenantadmin'
const password = 'tenantpassword'

// create instance of the client library
const client = new lib({username, password})

// list all users
client.listUsers()
.then(body => {
  // map the users to a more readable list of relevant info
  const users = body.map(v => {
    return {
      id: v.id,
      userName: v.userName,
      primaryRole: v.primaryRole,
      name: v.name,
      email: v.email,
      mobilePhone: v.mobilePhone,
      isEmailVerified: v.isEmailVerified,
      isActive: v.isActive
    }
  })
  // log results
  console.log(users)
})
.catch(e => console.log(e))

// create a user
// note: a prefix will be added to username on cloud server side
client.createUser({
  name: 'Rick Barrows 0325',
  username: 'rbarrows0325',
  email: 'ccondry@cisco.com',
  password: 'dcloud@123'
})
.then(body => console.log(body))
.catch(e => console.log(e))
```