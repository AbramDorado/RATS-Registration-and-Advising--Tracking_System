const express = require('express')
const database = require('../database/database')

// Routes
const router = express.Router()

  // Create Announcement
  router.post('/api/announcement/create', OCSandAdminOnly, (req, res) => {
    try {
      // check body
      if (!req.body.title || !req.body.body) {
        throw 'Invalid body'
      }
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run()
    } catch (error) {
      console.log('Error on api/announcement/create') // temp
      console.log(error) // temp
      res.send({message: error})
    }
  })
  // end Create Announcement

// end Routes

// Middlewares
function OCSandAdminOnly(req, res, next) {
  try {
    if (!req.user) {
      throw 'User not logged in'
    }
    if (req.user.role === 'ocs' || req.user.role === 'admin') {
      next()
    } else {
      throw 'User not ocs nor admin'
    }
  } catch (error) {
    console.log('Error on announcements.js > OCSandAdminOnly') // temp
    console.log(error)
    res.send({message: error})
  }
  if (!req.user) {
    return res.send({message: 'User not logged in'})
  } else {
    if (req.user.role )
  }
}
// end Middlewares

module.exports = router