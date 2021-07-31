const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const User = require('./models/user')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/login', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  const msg = 'Username or Password is wrong'
  User.find()
    .lean()
    .then((users) => {
      if (email || password) {
        users.forEach((user) => {
          let userName = user.firstName
          if (email === user.email && password === user.password) {
            res.render('index', { userName })
          }
        })
      } else {
        res.render('login', { msg: msg })
      }
    })
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})