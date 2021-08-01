const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
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
app.use(express.urlencoded({ extended: true }))
// 設定簽章
app.use(cookieParser('12345678'))

app.get('/', (req, res) => {
  const { email, password } = req.signedCookies

  if (email === '' || password === '') {
    res.render('login')
  }
  User.find({ email, password })
    .lean()
    .then((users) => {
      if (users.length === 1) {
        let userName = users[0].firstName
        res.render('index', { userName })
      } else {
        res.render('login')
      }
    })
    .catch(error => console.log(error))
  
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const msg = 'Username or Password is invalid'
  ind({ email, password })
    .lean()
    .then((users) => {
      if (users.length === 1) {
        res.cookie('email', email, { path: '/', signed: true, maxAge: 600000 });
        res.cookie('password', password, { path: '/', signed: true, maxAge: 600000 });
        res.redirect('/')
      } else {
        res.render('login', { msg: msg })
      }
    })
    .catch(error => console.log(error))
})

app.get('/logout', (req, res) => {
  res.clearCookie('email', { path: '/' });
  res.clearCookie('password', { path: '/' });
  return res.redirect('/')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})