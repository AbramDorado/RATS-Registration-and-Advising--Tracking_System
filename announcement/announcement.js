const express = require('express')
const database = require('../database/database')
const { v4: uuidv4 } = require('uuid');

// Routes
const router = express.Router()

  // Create Announcement
  router.post('/api/announcement/create', OCSandAdminOnly, async (req, res) => {
    try {
      // check body
      if (!req.body.title || !req.body.body) {
        throw 'Invalid body'
      }
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run(db, `
        INSERT INTO announcement (id, title, body, created, modified) VALUES (?, ?, ?, ?, ?)
      `, [uuidv4(), req.body.title, req.body.body, Date.now(), Date.now()], false)
      res.json({message: `Announcement added: ${req.body.title}`}).send()
    } catch (error) {
      console.log('Error on api announcement create') // temp
      console.log(error) // temp
      res.json({message: error}).send()
    }
  })
  // end Create Announcement

  // Get Next Announcements
  router.post('/api/announcement/next', async (req, res) => {
    try {
      // check body
      if (req.body.loaded == undefined) {
        throw 'Invalid request body'
      }
      // count announcements
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const result = await database.get(db, `SELECT COUNT(*) as count FROM announcement`, [], false)
      const difference = result.count - (req.body.loaded)
      if (difference <= 0) {
        res.json({more: 'false'}).send()
      } else if (difference > 0 && difference <= 10) {
        const result = await database.all(db, `SELECT * FROM announcement ORDER BY modified DESC LIMIT 10 OFFSET ${req.body.loaded}`, [], false)
        res.json({announcements: result, more: 'false'}).send()
      } else {
        const result = await database.all(db, `SELECT * FROM announcement ORDER BY modified DESC LIMIT 10 OFFSET ${req.body.loaded}`, [], false)
        res.json({announcements: result, more: 'true'}).send()
      }
    } catch (error) {
      console.log('Error on api announcement next')
      console.log(error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Get Next Announcements  

  // Update Announcement
  router.post('/api/announcement/edit', OCSandAdminOnly, async (req, res) => {
    try {
      // check body
      if (!req.body.old_body || !req.body.new_title || !req.body.new_body) {
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        // get original row
        const row = await database.get(db, `SELECT * FROM announcement WHERE body = ?`, [req.body.old_body], false)
        await database.run(db, `
          UPDATE announcement SET title = ?, body = ?, modified = ? WHERE body = ?
        `, [req.body.new_title, req.body.new_body, Date.now(), row.body], false)
        res.json({message: `Edit success for announcement ${row.title}`}).send()
      }
    } catch (error) {
      console.log('Error on api announcement edit')
      console.log(error)
      res.json({message: error}).send()
    }
  })
  // end Update Announcement

  // Delete Announcement
  router.post('/api/announcement/delete', OCSandAdminOnly, async (req, res) => {
    try {
      // check body
      if (!req.body.body) {
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `DELETE FROM announcement WHERE body = ?`, [req.body.body], false)
        res.json({message: `Delete success for body: ${req.body.body}`}).send()
      }
    } catch (error) {
      console.log('Error on api announcement delete')
      console.log(error)
      res.json({message: error}).json()
    }
  })
  // end Delete Announcement

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
}
// end Middlewares

module.exports = {router}