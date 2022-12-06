const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

  // course APIs
    // create
    router.post('/api/course/create', ocsOnly, async (req, res) => {
      // req.body: {class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, was_edited}
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `
          INSERT INTO course (
            class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, was_edited
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [req.body.class_number, req.body.department, req.body.course_title, req.body.subject, req.body.catalog_no, req.body.section, req.body.schedule, req.body.learning_delivery_mode, req.body.instructor, req.body.class_capacity, req.body.restrictions, 'false'], false)
        res.json({message: `Insert success for course ${req.body.class_number}`}).send()
      } catch (error) {
        console.log('Error on api > course > create', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end create

    // read all
    router.post('/api/course/read/all', async (req, res) => {
      try {
        // will store courses for each dept
        var DAC
        var DB
        var DBS
        var DPE
        var DPSM
        var DSS
        var MM
        // query each dept
        const source = './database/db.sqlite'
        const myDB = await database.openOrCreateDB(source)
        // DAC
        var rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no 
        `, ['DAC'], false)       
        DAC = rows
        // end DAC
        // DB
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['DB'], false)
        DB = rows
        // end DB
        // DBS
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['DBS'], false)
        DBS = rows
        // end DBS
        // DPE
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['DPE'], false)
        DPE = rows
        // end DPE
        // DPSM
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['DPSM'], false)
        DPSM = rows
        // end DPSM
        // DSS
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['DSS'], false)
        DSS = rows
        // end DSS
        // MM
        rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no
        `, ['MM'], false)
        MM = rows
        // end MM
        // end query each dept
        res.json({DAC: DAC, DB: DB, DBS: DBS, DPE: DPE, DPSM: DPSM, DSS: DSS, MM: MM}).send()
      } catch (error) {
        console.log('Error on api > course > read > all', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end read all

    // read one
    router.post('/api/course/read/one', async (req, res) => {
      // req.body = {class_number}
      try {
        const source = './database/db.sqlite'
        const db = database.openOrCreateDB(source)
        const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [req.body.class_number], false)
        res.json({row: row}).send()
      } catch (error) {
        console.log('Error on api > course > read > one', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end read one

    // update
    router.post('/api/course/update', ocsOnly, async (req, res) => {
      // req.body: {old_class_number, new_class_number department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, was_edited}    
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `
          UPDATE course SET class_number = ?, department = ?, course_title = ?, subject = ?, catalog_no = ?, section = ?, schedule = ?, learning_delivery_mode = ?, instructor = ?, class_capacity = ?, restrictions = ?, was_edited = ? WHERE class_number = ?
        `, [
          req.body.new_class_number, req.body.department, req.body.course_title, req.body.subject, req.body.catalog_no, req.body.section, req.body.schedule, req.body.learning_delivery_mode, req.body.instructor, req.body.class_capacity, req.body.restrictions, 'true', req.body.old_class_number
        ], false)
        // update course_edit table
          // delete row
          await database.run(db, `DELETE FROM course_edit WHERE class_number = ?`, [req.body.class_number], true)
          // end delete row
          // insert row
          await database.run(db, `INSERT INTO course_edit (class_number, last_modified) VALUES (?, ?)`, [req.body.class_number, Date.now()], false)
          // end insert row
        // end update course_edit table
        res.json({message: `Update success for ${req.body.subject} ${req.body.catalog_no} ${req.body.section}`})
      } catch (error) {
        console.log('Error on api > course > update', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end update

    // delete
    router.post('/api/course/delete', ocsOnly, async (req, res) => {
      // req.body = {class_number}
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `DELETE FROM course WHERE `, [], false)
      } catch (error) {
        console.log('Error on api > course > delete', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end delete
  // end course APIs

  // course_edit APIs

    // read all
    router.post('/api/course_edit/read/all', async (req, res) => {
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const rows = await database.all(db, `
          SELECT * FROM course_edit ORDER BY last_modified DESC
        `, [], false)
        res.json({rows: rows}).send()
      } catch (error) {
        console.log('Error on api > course_edit > read > all', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end read all

    // delete all
    router.post('/api/course_edit/delete/all', adminOnly, async (req, res) => {
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `DELETE FROM course_edit`, [], false)
        res.json({message: 'Deleted all rows from course_edit successfully'}).send()
      } catch (error) {
        console.log('Error on api > course_edit > delete > all', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end delete all

  // end course_edit APIS

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
    console.log('Error on course.js > adminOnly', error)
    res.status(401).json({message: error}).send()
  }
}
function ocsOnly(req, res, next) {
  try {
    if (req.user.role === 'ocs') {
      next()
    } else {
      throw 'User not OCS'
    }
  } catch (error) {
    console.log('Error on course.js > ocsOnly')
    console.log(error)
    res.status(401).json({message: error}).send()
  }
}
// end Middlewares

module.exports = {router}