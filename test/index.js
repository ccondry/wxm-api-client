require('dotenv').config()
const lib = require('../src')
const username = process.env.USERNAME
const password = process.env.PASSWORD

const client = new lib({username, password})

// // list all users
// client.listUsers()
// .then(body => {
//   // map the users to a more readable list of relevant info
//   const users = body.map(v => {
//     return {
//       id: v.id,
//       userName: v.userName,
//       primaryRole: v.primaryRole,
//       name: v.name,
//       email: v.email,
//       mobilePhone: v.mobilePhone,
//       isEmailVerified: v.isEmailVerified,
//       isActive: v.isActive
//     }
//   })
//   // log results
//   console.log(users)
// })
// .catch(e => console.log(e))

// create a user
// note: dcwxmbank prefix will be added to username on cloud server side
// client.createUser({
//   name: 'Rick Barrows 0325',
//   username: 'rbarrows0325',
//   email: 'ccondry@cisco.com',
//   password: 'dcloud@123'
// })
// .then(body => console.log(body))
// .catch(e => console.log(e))

// client.getAuthToken()
// .then(body => console.log(body))
// .catch(e => console.log(e))

// listPreferences
client.listPreferences()
.then(body => {
  const username = 'dcwxmbankrbarrows0325'
  const viewName = 'Contact Center'
  const ccview = body.views.find(v => v.viewName === viewName)
  const users = ccview.globalSyndicated.users
  if (users.includes(username)) {
    // already in list
    console.log(username, 'was already in the', viewName, 'view')
  } else {
    // add to list
    console.log('adding', username, 'to the', viewName, 'view')
    users.push(username)
  }
  // save updated preferences
  console.log('saving preferences...')
  client.setPreferences(body)
  .then(r => console.log('preferences saved.'))
  .catch(e => console.log('failed to save prefernces:', e))
})
.catch(e => console.log(e))