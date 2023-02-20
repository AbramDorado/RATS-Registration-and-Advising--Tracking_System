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
//advising
// Read All Advising Status All Departments
router.post('/api/advising/read/all/all', ocsOnly, async (req, res) => {
  try {
    // req.body = {offset, limit, column, order, searchString, filterByDepartmentText, filterByDegreeProgramText, filterByStep1StatusText, filterByStep2StatusText, filterByStep3StatusText }
    
    var myOffset = 0
    if (req.body.offset) {
      myOffset = req.body.offset
    }
    var myLimit = 50
    if (req.body.limit) {
      myLimit = req.body.limit
    }
    var sortColumn = 'department'
    if (req.body.column) {
      sortColumn = req.body.column
    }
    var sortOrder = 'ASC'
    if (req.body.order) {
      sortOrder = req.body.order
    }
    var searchString = ''
    if (req.body.searchString) {
      searchString = req.body.searchString
    }
  
    var filterByDepartmentText = ''
    if (req.body.filterByDepartmentText) {
      filterByDepartmentText = ` AND (department = '${req.body.filterByDepartmentText}')`
    }

    var filterByDegreeProgramText = ''
    if (req.body.filterByDegreeProgramText) {
      filterByDegreeProgramText = ` AND (degree_program) = '${req.body.filterByDegreeProgramText}')`
    }
    
    var filterByStep1StatusText = ''
    if (req.body.filterByStep1StatusText) {
      filterByStep1StatusText = ` AND (step1_status = '${req.body.filterByStep1StatusText}')`
    }

    var filterByStep2StatusText = ''
    if (req.body.filterByStep2StatusText) {
      filterByStep2StatusText = ` AND (step2_status = '${req.body.filterByStep2StatusText}')`
    }
    
    var filterByStep3StatusText = ''
    if (req.body.filterByStep3StatusText) {
      filterByStep3StatusText = ` AND (step3_status = '${req.body.filterByStep3StatusText}')`
    }

    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const rows = await database.all(db, `
      SELECT *
      FROM advising_status 
      WHERE
        (
          student_up_mail LIKE '%${searchString}%'
          OR adviser_up_mail LIKE '%${searchString}%'
          OR degree_program LIKE '%${searchString}%'
          OR department LIKE '%${searchString}%'
          OR step1_status LIKE '%${searchString}%'
          OR step2_status LIKE '%${searchString}%'
          OR step3_status LIKE '%${searchString}%'
        )
        ${filterByDepartmentText}
        ${filterByDegreeProgramText}
        ${filterByStep1StatusText}
        ${filterByStep2StatusText}
        ${filterByStep3StatusText}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${myLimit}
      OFFSET ${myOffset}`, [], false)
    res.send(rows)
  } catch (error) {
    console.log('error on /api/advising/read/all/all') // temp
    console.log(error)
    res.send('Error')
  }
})
// end Read All Advising Status All Departments

// Read All Advising Status by Adviser
router.post('/api/advising/read/all/adviser', adviserOnly, async (req, res) => {
  try {
    // req.body = {adviser_up_mail, offset, limit, column, order, searchString, filterByRole}
    var myOffset = 0
    if (req.body.offset) {
      myOffset = req.body.offset
    }
    var myLimit = 50
    if (req.body.limit) {
      myLimit = req.body.limit
    }
    var sortColumn = 'degree_program'
    if (req.body.column) {
      sortColumn = req.body.column
    }
    var sortOrder = 'ASC'
    if (req.body.order) {
      sortOrder = req.body.order
    }
    var searchString = ''
    if (req.body.searchString) {
      searchString = req.body.searchString
    }
    var filterByDegreeProgramText = ''
    if (req.body.filterByDegreeProgramText) {
      filterByDegreeProgramText = ` AND (degree_program) = '${req.body.filterByDegreeProgramText}')`
    }
    
    var filterByStep1StatusText = ''
    if (req.body.filterByStep1StatusText) {
      filterByStep1StatusText = ` AND (step1_status = '${req.body.filterByStep1StatusText}')`
    }

    var filterByStep2StatusText = ''
    if (req.body.filterByStep2StatusText) {
      filterByStep2StatusText = ` AND (step2_status = '${req.body.filterByStep2StatusText}')`
    }
    
    var filterByStep3StatusText = ''
    if (req.body.filterByStep3StatusText) {
      filterByStep3StatusText = ` AND (step3_status = '${req.body.filterByStep3StatusText}')`
    }
    
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const rows = await database.all(db, `
      SELECT student_up_mail, degree_program, step1_status, step2_status, step3_status 
      FROM advising_status 
      WHERE
        (student_up_mail LIKE '%${searchString}%'
        OR degree_program LIKE '%${searchString}%'
        OR step1_status LIKE '%${searchString}%'
        OR step2_status LIKE '%${searchString}%'
        OR step3_status LIKE '%${searchString}%')
        ${filterByDegreeProgramText}
        ${filterByStep1StatusText}
        ${filterByStep2StatusText}
        ${filterByStep3StatusText}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${myLimit}
      OFFSET ${myOffset}`, [], false)
    res.send(rows)
  } catch (error) {
    console.log('error on /api/advising/read/all/adviser') // temp
    console.log(error)
    res.send('Error')
  }
})
// end Read All Advising Status by Adviser

// Update Status
router.post('/api/advising_status/update', adviserOnly, async (req, res) => {
  // req.body = {student_up_mail, status}
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    await database.run(db, `
      UPDATE advising_status SET step2_status = ? WHERE student_up_mail = ?
    `, [req.body.status, req.body.student_up_mail], false)
    res.json({message: `Updated status for ${req.body.student_up_mail} to ${req.body.status} successfully`}).send()
  } catch (error) {
    console.log('Error on api > advising_status > update', error)
    res.json({message: error}).send()
  }
})
// end Update Status

// Delete All Status
router.post('/api/advising_status/delete/all', ocsOnly, async (req, res) => {
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    await database.run(db, `DELETE FROM advising_status`, [], false)
    res.json({message: 'Deleted all rows from advising_status successfully'}).send()
  } catch (error) {
    console.log('Error on api > advising_status > delete > all', error)
    res.status(401).json({message: error}).send()
  }
})
// end Delete All Status

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
      // update advising_status
      await database.run(db, `UPDATE advising_status SET step1_status = ? WHERE student_up_mail = ?`, ['done', req.user.up_mail], false)
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

// Read Curri Progress Using Adviser Account
router.post('/api/advising/curri/read/adviser', adviserOnly, async (req, res) => {
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const row = await database.get(db, `SELECT * FROM curri_progress WHERE student_up_mail = ?`, [req.body.student_up_mail], false)
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
    console.log('Error on advising.js > api > advising > curri > read > adviser')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
})
// end Read Curri Progress Using Adviser Account

// Read All Curri Progress
router.post('/api/advising/curri/read/all', adviserOnly, async (req, res) => {
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    const rows = await database.all(db, `
      SELECT * FROM curri_progress
    `, [], false)
    res.json({rows: rows}).send()
  } catch (error) {
    console.log('Error on api > advising > curri > read > all', error)
    res.status(401).json({message: error}).send()
  }
})
// end Read All Curri Progress

// Delete All Status
router.post('/api/advising/curri/delete/all', ocsOnly, async (req, res) => {
  try {
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    await database.run(db, `DELETE FROM curri_progress`, [], false)
    res.json({message: 'Deleted all rows from curri_progress successfully'}).send()
  } catch (error) {
    console.log('Error on api > advising > curri > delete > all', error)
    res.status(401).json({message: error}).send()
  }
})
// end Delete All Status

// Middlewares
function adminOnly(req, res, next){
  try{
    if (req.user.role !== 'admin') {
      throw 'User not Admin'
    } else {
      next()
    }
  } catch(error){
    console.log('Error on admin.js > adminOnly', error)
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
function adviserOrStudentOnly(req, res, next){
  try{
    if (req.user.role === 'adviser' || req.user.role === 'student') {
      next()
    } else {
      throw 'User not Adviser nor Student'
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
    console.log('Error on advising.js > ocsOnly', error)
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