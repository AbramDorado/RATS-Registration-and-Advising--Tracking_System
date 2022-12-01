const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Get Status
// Required Request Body: student_up_mail
router.post('/api/advising/getStatus', loggedIn, async (req, res) => {
  try {
    if (!req.body.student_up_mail) {
      throw 'Invalid request body'
    } else {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const result = await database.get(db, `
        SELECT step1_status, step2_status, step3_status FROM advising_status WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      res.json({step1_status: result.step1_status, step2_status: result.step2_status, step3_status: result.step3_status}).send()
    }
  } catch (error) {
    console.log('Error in api advising getStatus')
    console.log(error)
    res.json({messsage: error}).send()
  }
})
// end Get Status

// Create/Update Curri Progress
// Required Body: curri_progress
router.post('/api/advising/curri/update', studentOnly, async (req, res) => {
  try {
    // check if there is existing record
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const row = await database.get(db, `SELECT * FROM curri_progress WHERE student_up_mail = ?`, [req.user.up_mail], false)
    if (row) {
      // update record
      await database.run(db, `UPDATE curri_progress SET curri_progress = ?, modified = ? WHERE student_up_mail = ?`, [JSON.stringify(req.body.curri_progress), Date.now(), req.user.up_mail], false)
      res.json({message: 'Updated'}).send()
    } else {
      // no existing record, create one
      await database.run(db, `INSERT INTO curri_progress (
        student_up_mail,
        curri_progress,
        created,
        modified
      ) VALUES (?, ?, ?, ?)`, [req.user.up_mail, JSON.stringify(req.body.curri_progress), Date.now(), Date.now()], false)
      // update advising_status
      await database.run(db, `UPDATE advising_status SET step1_status = ? WHERE student_up_mail = ?`, ['done', req.user.up_mail], false)
      res.json({message: 'Created'}).send()
    }
  } catch (error) {
    console.log('Error on advising.js > api > advising > curri > update')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
}) 
// end Create/Update Curri Progress

// Read Curri Progress
router.post('/api/advising/curri/read', studentOnly, async (req, res) => {
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const row = await database.get(db, `SELECT * FROM curri_progress WHERE student_up_mail = ?`, [req.user.up_mail], false)
    if (row) {
      // const row_parsed = {
      //   student_up_mail: row.student_up_mail,
      //   curri_progress: JSON.parse(curri_progress)
      // }
      res.status(200).json({row: row}).send()
    } else {
      res.status(200).json({message: 'No record found'}).send()
    }
  } catch (error) {
    console.log('Error on advising.js > api > advising > curri > read')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
})
// end Read Curri Progress

// Middlewares
function loggedIn(req, res, next) {
  try {
    if (!req.user) {
      throw 'User not logged in'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error in advising.js > loggedIn middleware')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
}
function studentOnly(req, res, next) {
  try {
    if (req.user.role !== 'student') {
      throw 'User is not student'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on advising.js > studentOnly()')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
}
// end Middlewares

module.exports = {router}