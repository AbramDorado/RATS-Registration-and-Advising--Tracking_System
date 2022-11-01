// Authentication using Passport Google OpenIDConnect Strategy

const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const db = require('./database/database')

// GoogleStrategy Configuration
// passport.use(new GoogleStrategy({
//   clientID: '120783145933-io3dchjplgr1hktfm9fatrkn22adm8jb.apps.googleusercontent.com',
//   clientSecret: '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',
//   callbackURL: '/oauth2/redirect/google',
//   scope: [ 'https://www.googleapis.com/auth/userinfo.email', 'profile' ],
// }, function verify(issuer, profile, cb) {
//   // console.log('started verify()') // temp
//   // console.log('profile is', profile) // temp
//   if (profile.emails[0].value.search('@up.edu.ph') === -1) {
//     // console.log('non up mail')
//     const whiteListedEmails = ['jpmlicup@gmail.com', 'jpmlicup10@gmail.com']
//     // console.log('whitelisted?', whiteListedEmails.indexOf('jpmlicup10@gmail.com'), profile.emails[0]) // temp
//     if (whiteListedEmails.indexOf('jpmlicup10@gmail.com') === -1) { // temp whitelisted accounts
//       return cb(null, false, {message: 'err non up mail'})
//     }
//   }
//   // console.log('role check passed') // temp
//   db.get('SELECT * FROM role WHERE up_mail = ?', [ profile.emails[0].value ], function(err, row) {
//     if (err) { return cb(err); }
//     if (!row) { return cb(null, false); }

//     // clear dead sessions
//     // console.log('clearDeadCookies called') // temp
//     const sessionDB = new sqlite3.Database('./database/sessions.db')
//     // console.log('row.upmail is', row.up_mail) // temp
//     var now = new Date().getTime();
//     // console.log('now is', now) // temp
//     sessionDB.run('DELETE FROM sessions WHERE ? > expired', [now]);


//     // console.log(`new Date().toISOString() is`, new Date().toISOString()) // temp
//     // sessionDB.run(`DELETE FROM sessions WHERE json_extract(sess, '$.passport.user.up_mail') = ?`, [row.up_mail], (err, row2) => {
//     //   console.log('sessionDB row2 is', row2) // temp
//     // })

//     return cb(null, row)
//   })
// }))

// passport.serializeUser(function(user, cb) {
//   // console.log('serializing user') // temp
//   process.nextTick(function() {
//     // console.log('serializing user...') // temp
//     // console.log('serializing() user is', user) // temp
//     cb(null, user)
//   })
// })

// passport.deserializeUser(function(user, cb) {
//   // console.log('deserializing user') // temp
//   process.nextTick(function() {
//     // console.log('deserializing user...') // temp
//     // console.log('deserialize() user is', user) // temp
//     if (user.role === 'student') {
//       db.get('SELECT * FROM student WHERE up_mail = ?', [user.up_mail], (err, row) => {
//         if (err) {
//           // console.log('error on deserialize', err) // temp
//           return cb(null, null)
//         } else {
//           // console.log('row is', row) // temp
//           return cb(null, row)
//         }
//       })
//     } else if (user.role === 'adviser') {
//       db.get('SELECT * FROM program_adviser WHERE up_mail = ?', [user.up_mail], (err, row) => {
//         if (err) {
//           // console.log('error on deserialize', err) // temp
//           return cb(null, null)
//         } else {
//           // console.log('row is', row) // temp
//           return cb(null, row)
//         }
//       })      
//     } else if (user.role === 'admin') {
//       db.get('SELECT * FROM admin WHERE up_mail = ?', [user.up_mail], (err, row) => {
//         if (err) {
//           // console.log('error on deserialize', err) // temp
//           return cb(null, null)
//         } else {
//           // console.log('row is', row) // temp
//           return cb(null, row)
//         }
//       })        
//     } else {
//       console.log('role is not student')
//     }
//     // to do: for other roles
//     // return cb(null, user); // original
//   })
// })
// end GoogleStrategy Configuration

// Routes
const router = express.Router();

  // authorize
  // router.post('/api/authorize', (req, res) => {
    
  // })
  // end authorize

  // login
  // router.get('/api/login/federated/google', passport.authenticate('google'))
  // router.get('/oauth2/redirect/google', passport.authenticate('google', {
  //   failureRedirect: '/login?error=1'
  // }), (req, res) => {
  //   // console.log('oauth2 req.session is', req.session) // temp
  //   // console.log('oauth2 req.cookies is', req.cookies) // temp
  //   if (req.cookies.remember === 'true') {
  //     // console.log('cookies maxage set to 7 days') // temp
  //     req.session.cookie.maxAge = 604800000 // 7 days
  //     // req.session.cookie.maxAge = 10000
  //   } else {
  //     // console.log('cookie maxage was not extended') // temp
  //   }
  //   // console.log('req.user.role is', req.user.role) // temp
  //   if (req.user.role === 'admin') {
  //     res.redirect('/admin')
  //   } else {
  //     res.redirect('/')
  //   }
  // })
  // end login

  // logout
  // router.get('/logout', function(req, res, next) {
  //   req.logout(function(err) {
  //     if (err) { return next(err); }
  //     res.redirect('/')
  //   })
  // })
  // end logout

module.exports = router
// end Routes
