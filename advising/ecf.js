const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

  // Create
  router.post('/api/ecf/create', studentOnly, async (req, res) => {
    // req.body = {student_up_mail, class_number, adviser_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run(db, `
        INSERT INTO ecf (
          student_up_mail,
          class_number,
          adviser_up_mail
        ) VALUES (?, ?, ?)
      `, [req.body.student_up_mail, req.body.class_number, req.body.adviser_up_mail], false)
      res.json({message: `Create ecf row for ${req.body.student_up_mail} ${req.body.class_number} for adviser ${req.body.adviser_up_mail}`}).send()
    } catch (error) {
      console.log('Error on api > ecf > create', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Create

  // Read All Rows from Student
  router.post('/api/ecf/read/all/student', studentOnly, async (req, res) => {
    // req.body = {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT * FROM ecf WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      res.json({rows: rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > student', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All from Student

  // Read All Rows from Student And from Adviser
  router.post('/api/ecf/read/all/adviser', adviserOnly, async (req, res) => {
    // req.body = {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT * FROM ecf WHERE adviser_up_mail = ? AND student_up_mail = ?
      `, [req.user.up_mail, req.body.student_up_mail], false)
      res.json({rows: rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > adviser', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All Rows from Student And from Adviser

  // Delete One
  router.post('/api/ecf/delete', studentOnly, async (req, res) => {
    // req.body = {class_number}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run(db, `DELETE FROM ecf WHERE student_up_mail = ? AND class_number = ?`, [req.user.up_mail, req.body.class_number], false)
      res.json({message: `Delete ecf row for student ${req.user.up_mail} with class number ${req.body.class_number}`}).send()
    } catch (error) {
      console.log('Error on api > ecf > delete > all', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Delete One

  // Delete All
  router.post('/api/ecf/delete/all', adminOnly, async (req, res) => {
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run(db, `DELETE FROM ecf`, [], false)
      res.json({message: 'Deleted all rows from ecf successfully'}).send()
    } catch (error) {
      console.log('Error on api > ecf > delete > all', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Delete All

// end Routes

// Middlewares
function adminOnly(res, req, next){
  try{
    if (req.user.role !== 'admin') {
      throw 'User not Admin'
    } else {
      next()
    }
  } catch(error){
    console.log('Error on ecf.js > adminOnly', error)
    res.status(401).json({message: error}).send()
  }
}
function adviserOnly(res, req, next){
  try{
    if (req.user.role !== 'adviser') {
      throw 'User not Adviser'
    } else {
      next()
    }
  } catch(error){
    console.log('Error on advising.js > adviserOnly', error)
    res.status(401).json({message: error}).send()
  }
}
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
function OcsOnly(req, res, next) {
  try {
    if (req.user.role !== 'ocs') {
      throw 'User not OCS'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on advising.js > OcsOnly', error)
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