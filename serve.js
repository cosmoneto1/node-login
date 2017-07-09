const express = require('express')
const app = express()
const path = require('path')
const favicon = require('serve-favicon')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const cookieSession = require('cookie-session')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// view engine ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//controle do cookie do usuário
app.use(cookieSession({
  name: 'session', keys: ['ilovenodejs'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Passport start no expressjs
app.use(passport.initialize())
app.use(passport.session())

//middleware no passport-local: verifica login e senha
passport.use(new LocalStrategy(function(login, senha, done) {
  console.log('login', login)
  console.log('senha', login)
  if (login == 'teste@teste.com' && senha == '123') {
    var userL = {
      id: 1,
      email: login,
      'senha': senha
    }
    return done(null, userL)
  } else {
    return done(null, false)
  }

}));

//carrega os dados do usuário na session
passport.serializeUser(function(user, done) {
  console.log('user', user)
  done(null, user.id)
})
//limpa os dados do usuário na session -> logout
passport.deserializeUser(function(id, done) {
  if (id == 1) {
    var user = {
      id: 1,
      email: 'teste@teste.com',
      senha: 123
    }
    var err
    done(err, user)
  } else {
    done(err, false)
  }
})

//routes
//-----------------------------------------------------
app.get('/', function(req, res) {
  res.render('index')
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}), function(req, res) {
  console.log(req.body)
  res.redirect('/home')
})

//=======================================================
//route middleware verifica session do usuário
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
//=======================================================

app.get('/home', isLoggedIn, function(req, res) {
  console.log('home', req.user)
  res.render('home', {'user': req.user})
})

//route logout
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
});

//route verifca session do usuário
app.get('/verificar/session', function(req, res) {
  if (req.isAuthenticated()) {
    res.status(200).send('')
  } else {
    res.status(401).send('')
  }
});

app.listen(3000, function() {
  console.log('Servidor Nodejs Start localhost:3000')
})
