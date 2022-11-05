const express = require('express')
const passport = require('passport')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const GoogleStrategy = require('passport-google-oidc')
const database = require('../database/database')
const { v4: uuidv4 } = require('uuid');

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
          const userWithoutId = {role: user.role, up_mail: user.up_mail, first_name: user.first_name, last_name: user.last_name}
          return cb(null, userWithoutId);
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

  // get all users
  router.post('/api/getUsers', adminOnly, async (req, res) => {
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT * FROM user
      `, [], false)
      res.send(rows)
    } catch (error) {
      console.log('error on /api/getUsers') // temp
      console.log(error)
      res.send('Error')
    }
  })

  // authorize
  router.post('/api/authorize', (req, res) => {
    if (req.user) {
      res.send(req.user) // TEMP
    } else {
      res.status(401).send()
    }
  })
  // end authorize

  // register
  router.post('/api/register', adminOnly, async (req, res) => {
    try {
      // body checker
      if (!req.body.role || !req.body.up_mail || !req.body.first_name || !req.body.last_name) {
        // invalid body
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const row = await database.get(db, `
          SELECT * FROM user WHERE up_mail = ?
        `, [req.body.up_mail], false)
        if (row) {
          // user with up_mail already exists
          throw 'User with up_mail already exists'
        } else {
          // insert the new user
          await database.run(db, `
            INSERT INTO user (id, role, up_mail, first_name, last_name) VALUES (?, ?, ?, ?, ?)
          `, [uuidv4(), req.body.role, req.body.up_mail, req.body.first_name, req.body.last_name], false)
          res.send('Register success.')
        }
      }
    } catch (error) {
      console.log('Error on /api/register') // temp
      console.log(error) // temp
      res.status(401).send(error)
    }
  })

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
      if (err) { res.json({"message": "Error on logout.", "error": err, "redirect": "/"}).send() }
      res.json({"message": "Logout success.", "redirect": "/login?loggedOut=true"})
    })
  })
  // end logout

  // edit user
  router.post('/api/editUser', adminOnly, async (req, res) => {
    try {
      // body checker
      if (!req.body.role || !req.body.up_mail || !req.body.first_name || !req.body.last_name) {
        // invalid body
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const row = await database.get(db, `
          SELECT * FROM user WHERE up_mail = ?
        `, [req.user.up_mail], false)
        if (row) {
          // user with up_mail exists
          // update user
          await database.run(db, `
            UPDATE user SET role = ?, first_name = ?, last_name = ? WHERE up_mail = ? 
          `, [req.body.role, req.body.first_name, req.body.last_name, req.body.up_mail], false)
          res.send('Edit success.')
        } else {
          throw 'No user with that upmail'
        }
      }
    } catch (error) {
      console.log('Error on /api/editUser') // temp
      console.log(error) // temp
      res.status(401).send(error)
    }
  })
  // end edit user

  // delete user
  router.post('/api/deleteUser', adminOnly, async (req, res) => {
    try {
      // body checker
      if (!req.body.up_mail) {
        // invalid body
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const row = await database.get(db, `
          SELECT * FROM user WHERE up_mail = ?
        `, [req.user.up_mail], false)
        if (row) {
          // user with up_mail exists
          // delete user
          await database.run(db, `
            DELETE FROM user WHERE up_mail = ?
          `, [req.body.up_mail], false)
          res.send('Delete success.')
        } else {
          throw 'No user with that upmail'
        }
      }
    } catch (error) {
      console.log('Error on /api/deleteUser') // temp
      console.log(error) // temp
      res.status(401).send(error)
    }
  })
  // end delete user

  // middlewares
  function adminOnly(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        res.status(401).send('Not admin.')
      } else {
        next()
      }
    } catch (error) {
      console.log('Error on auth.js > adminOnly middleware') // temp
      console.log(error) // temp
      res.status(401).send()
    }
  }

// end Routes

module.exports = {main, configureGoogleStrategy, router}