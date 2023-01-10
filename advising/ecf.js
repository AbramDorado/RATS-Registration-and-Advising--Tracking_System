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
        INSERT OR REPLACE INTO ecf (
          id,
          student_up_mail,
          class_number,
          adviser_up_mail
        ) VALUES (?, ?, ?, ?)
      `, [req.user.up_mail+req.body.class_number, req.user.up_mail, req.body.class_number, req.body.adviser_up_mail], false)
      // update advising_status
      await database.run(db, `UPDATE advising_status SET step2_status = ? WHERE student_up_mail = ?`, ['waiting for approval', req.user.up_mail], false)
      res.json({message: `Added ${req.body.class_number} to student ${req.body.student_up_mail}'s ECF with adviser ${req.body.adviser_up_mail}`}).send()
    } catch (error) {
      console.log('Error on api > ecf > create', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Create

  // Read All Rows from Student
  router.post('/api/ecf/read/all/student', studentOrOCSOnly, async (req, res) => {
    // req.body = {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const ecf_rows = await database.all(db, `
        SELECT * FROM ecf WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      var ecf_complete_rows = []
      for (let i=0; i<ecf_rows.length; i++) {
        const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [ecf_rows[i].class_number], false)
        ecf_complete_rows.push(row)
      }
      res.json({rows: ecf_complete_rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > student', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All from Student

  // Read All from Student Using Adviser Account
  router.post('/api/ecf/read/all/student/adviserAcc', adviserOnly, async (req, res) => {
    // required body: {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const ecf_rows = await database.all(db, `
        SELECT * FROM ecf WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      var ecf_complete_rows = []
      for (let i=0; i<ecf_rows.length; i++) {
        const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [ecf_rows[i].class_number], false)
        ecf_complete_rows.push(row)
      }
      res.json({rows: ecf_complete_rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > student > adviserAcc', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All from Student Using Adviser Account

  // Read All from Student Using OCS Account
  router.post('/api/ecf/read/all/student/ocsAcc', ocsOnly, async (req, res) => {
    // required body: {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const ecf_rows = await database.all(db, `
        SELECT * FROM ecf WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      var ecf_complete_rows = []
      for (let i=0; i<ecf_rows.length; i++) {
        const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [ecf_rows[i].class_number], false)
        ecf_complete_rows.push(row)
      }
      res.json({rows: ecf_complete_rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > student > ocsAcc', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All from Student Using OCS Account

  // Read All Rows from Student And from Adviser
  router.post('/api/ecf/read/all/adviser', adviserOnly, async (req, res) => {
    // req.body = {student_up_mail}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT
          user.up_mail, user.first_name, user.last_name, user.degree_program, user.sais_id, user.student_number, advising_status.step1_status, advising_status.step2_status
        FROM user INNER JOIN advising_status
          ON user.up_mail = advising_status.student_up_mail
        WHERE user.adviser_up_mail = ?
      `, [req.user.up_mail], false)
      res.json({rows: rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > adviser', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All Rows from Student And from Adviser

  // Read All (Student Details, Advising Status, ECF Data) from Student Using OCS Account
  router.post('/api/ecf/read/all/OCS', ocsOnly, async (req, res) => {
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT
          user.up_mail, user.first_name, user.last_name, user.degree_program, user.sais_id, user.student_number, user.adviser_up_mail, user.department, advising_status.step1_status, advising_status.step2_status
        FROM user INNER JOIN advising_status
          ON user.up_mail = advising_status.student_up_mail
        WHERE user.role = ?
      `, ['student'], false)
      res.json({rows: rows}).send()
    } catch (error) {
      console.log('Error on api > ecf > read > all > OCS', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Read All (Student Details, Advising Status, ECF Data) from Student Using OCS Account

  // Delete One
  router.post('/api/ecf/delete', studentOnly, async (req, res) => {
    // req.body = {class_number}
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      await database.run(db, `DELETE FROM ecf WHERE student_up_mail = ? AND class_number = ?`, [req.user.up_mail, req.body.class_number], false)
      // update advising_status
      await database.run(db, `UPDATE advising_status SET step2_status = ? WHERE student_up_mail = ?`, ['waiting for approval', req.user.up_mail], false)      
      res.json({message: `Delete ecf row for student ${req.user.up_mail} with class number ${req.body.class_number}`}).send()
    } catch (error) {
      console.log('Error on api > ecf > delete > all', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Delete One

  // Delete All
  router.post('/api/ecf/delete/all', ocsOnly, async (req, res) => {
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
function adminOnly(req, res, next){
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
function adviserOnly(req, res, next){
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
function ocsOnly(req, res, next) {
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
function studentOrOCSOnly(req, res, next) {
  try {
    if (req.user.role === 'student' || req.user.role === 'ocs') {
      next()
    } else {
      throw 'Not student nor OCS'
    }
  } catch (error) {
    console.log('Error on advising.js > studentOrOCSOnly()')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
}
// end Middlewares

module.exports = {router}