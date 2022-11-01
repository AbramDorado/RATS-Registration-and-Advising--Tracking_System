// Authentication using Passport Google OpenIDConnect Strategy

const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const db = require('../database/database')
const utils = require('../database/utils')

// GoogleStrategy Configuration
passport.use(new GoogleStrategy({
  clientID: '120783145933-io3dchjplgr1hktfm9fatrkn22adm8jb.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'https://www.googleapis.com/auth/userinfo.email', 'profile' ],
}, async function verify(issuer, profile, cb) {
  try {
    const row = await utils.dbGet(`SELECT * FROM user WHERE up_mail = ?`, [profile.emails[0].value], false) 
    // console.log('verify > row is', row) // temp
    if (!row) {
      return cb(null, false)
    } else {
      return cb(null, row)
    }
  } catch (error) {
    console.error('Error on google verify') // temp
    console.error(error) // temp
  }
}))

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
// end GoogleStrategy Configuration

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
    if (req.cookies.remember === 'true') {
      req.session.cookie.maxAge = 604800000 // 7 days
    }
    // if you want to redirect different roles to different urls, do it here
    res.redirect('/')
  })
  // end login

  // logout
  router.post('/api/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/')
    })
  })
  // end logout

module.exports = router
// end Routes

// Notes

// Passport API
// https://github.com/jaredhanson/passport

// Passport Google OIDC API
// https://github.com/jaredhanson/passport-google-openidconnect