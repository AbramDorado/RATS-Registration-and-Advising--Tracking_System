const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

  // course APIs
    // create
    router.post('/api/course/create', ocsOnly, async (req, res) => {
      // req.body: {register_type, class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, units}
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const ress = await database.run(db, `
          INSERT INTO course (
            class_number,
            department,
            course_title,
            subject,
            catalog_no,
            section,
            component,
            schedule,
            learning_delivery_mode,
            room_assigned,
            instructor,
            class_capacity,
            restrictions,
            units
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [req.body.class_number,
          req.body.department,
          req.body.course_title,
          req.body.subject,
          req.body.catalog_no,
          req.body.section,
          req.body.component,
          req.body.schedule,
          req.body.learning_delivery_mode,
          req.body.room_assigned,
          req.body.instructor,
          req.body.class_capacity,
          req.body.restrictions,
          req.body.units], false)
        // if single register
        if (req.body.registration_type !== 'batch') {
          // insert addition in course_edit
          await database.run(db, `
              INSERT INTO course_edit (
                class_number, subject, catalog_no, section, modification, last_modified
              ) VALUES (?, ?, ?, ?, ?, ?)
          `, [req.body.class_number, req.body.subject, req.body.catalog_no, req.body.section, 'Addition', Date.now()], false)
          // end insert addition in course_edit
        }
        // end if single register
        res.json({message: `Insert success for course ${req.body.class_number}`}).send()
      } catch (error) {
        console.log('Error on api > course > create', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end create

    // read all by dept
    router.post('/api/course/read/all', async (req, res) => {
      // req.body = {dept}
      try {
        const source = './database/db.sqlite'
        const myDB = await database.openOrCreateDB(source)
        const rows = await database.all(myDB, `
          SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no 
        `, [req.body.dept], false)
        res.json({rows: rows}).send()
      } catch (error) {
        console.log('Error on api > course > read > all', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end read all by dept

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
      // req.body: {old_class_number, new_class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, units}    
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `
          UPDATE course SET class_number = ?, department = ?, course_title = ?, subject = ?, catalog_no = ?, section = ?, component = ?, schedule = ?, learning_delivery_mode = ?, room_assigned = ?, instructor = ?, class_capacity = ?, restrictions = ?, units = ? WHERE class_number = ?
        `, [
          req.body.class_number, req.body.department, req.body.course_title, req.body.subject, req.body.catalog_no, req.body.section, req.body.component, req.body.schedule, req.body.learning_delivery_mode, req.body.room_assigned, req.body.instructor, req.body.class_capacity, req.body.restrictions, req.body.units, req.body.class_number
        ], false)
        // update course_edit table
          // insert row with 'updated' modification type
          await database.run(db, `INSERT OR REPLACE INTO course_edit (class_number, subject, catalog_no, section, modification, last_modified) VALUES (?, ?, ?, ?, ?, ?)`, [req.body.class_number, req.body.subject, req.body.catalog_no, req.body.section, 'Updated', Date.now()], false)
          // end insert row with 'updated' modification type
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
        // get original course row
        const row = await database.get(db, `
          SELECT subject, catalog_no, section FROM course WHERE class_number = ?
        `, [req.body.class_number], false)
        console.log('get original row success') // temp
        console.log('row is', row) // temp
        // end get original course row        
        await database.run(db, `DELETE FROM course WHERE class_number = ?`, [req.body.class_number], false)
        console.log('delete success') // temp
        await database.run(db, `DELETE FROM ecf WHERE class_number = ?`, [req.body.class_number], false)
        // insert into course_edit
        await database.run(db, `
          INSERT OR REPLACE INTO course_edit (
            class_number, subject, catalog_no, section, modification, last_modified
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [req.body.class_number, row.subject, row.catalog_no, row.section, 'Dissolved', Date.now()], false)
        console.log('insert into course_edit success') // temp
        // end insert into course_edit
        res.json({message: `Delete success for class_number ${req.body.class_number}`}).send()
      } catch (error) {
        console.log('Error on api > course > delete', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end delete

    // delete all
    router.post('/api/course/delete/all', ocsOnly, async (req, res) => {
      try {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `DELETE FROM course`, [], false)
        res.json({message: 'Deleted all rows from course successfully'}).send()
      } catch (error) {
        console.log('Error on api > course > delete > all', error)
        res.status(401).json({message: error}).send()
      }
    })
    // end delete all

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
    router.post('/api/course_edit/delete/all', ocsOnly, async (req, res) => {
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