const express = require('express')
const passport = require('passport')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const GoogleStrategy = require('passport-google-oidc')
const database = require('../database/database')

async function main(app) {
  return new Promise(async (resolve, reject) => {
    try {
      app.use(session({
        secret: 'zrfvnzr',
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'session.db', dir: './database' })
      }))
      app.use(passport.initialize())
      app.use(passport.session())
      resolve()
    } catch (error) {
      console.log('Error on auth.js > main') // temp
      console.log(error) // temp
      reject()
    }
  })
}

async function configureGoogleStrategy(db) {
  return new Promise(async (resolve, reject) => {
    try {

      // Configure GoogleStrategy
      passport.use(new GoogleStrategy({
        clientID: '120783145933-io3dchjplgr1hktfm9fatrkn22adm8jb.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/oauth2/redirect/google',
        scope: [ 'https://www.googleapis.com/auth/userinfo.email', 'profile' ],
      }, async function verify(issuer, profile, cb) {
        // console.log('profile.emails[0].value is', profile.emails[0].value) // temp
        const row = await database.get(db, `
          SELECT * FROM user WHERE up_mail = ?
        `, [
          profile.emails[0].value
        ], false)
        // console.log('row is', row) // temp
        if (row) {
          return cb(null, row)
        } else {
          return cb(null, false)
        }
      }))

      // serialize() and deserialize()
      passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          // console.log('serializingUser > user is', user) // temp
          cb(null, user)
        })
      })
      
      passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          // console.log('deserializeUser > user is', user) // temp
          return cb(null, user);
        })
      })

      resolve()
    } catch (error) {
      console.log('Error on auth.js > configureGoogleStrategy') // temp
      console.log(error) // temp
      reject()
    }
  })
}

// Routes
const router = express.Router();

  // authorize
  router.post('/api/authorize', (req, res) => {
    if (req.user) {
      res.send(req.user) // TEMP
    } else {
      res.status(401).send()
    }
  })
  // end authorize

  // login
  router.get('/api/login/federated/google', passport.authenticate('google'))
  router.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login?error=1'
  }), (req, res) => {
    try {
      if (req.cookies.remember === 'true') {
        req.session.cookie.maxAge = 604800000 // 7 days
      }
    } catch (error) {
      
    }
    // if you want to redirect different roles to different urls, do it here
    res.redirect('/')
  })
  // end login

  // logout
  router.post('/api/logout', function(req, res) {
    req.logout(function(err) {
      if (err) { res.redirect('/') }
      res.redirect('/')
    })
  })
  // end logout

// end Routes

module.exports = {main, configureGoogleStrategy, router}