const mongoose = require('mongoose')
const User = require('../user')
const { users } = require('../../users.json')

mongoose.connect('mongodb://localhost/login', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
  User.create(users)
    .then(() => {
      console.log('user seed done')
      return db.close()
    })
    .then(() => {
      console.log('connection close')
    })
})

