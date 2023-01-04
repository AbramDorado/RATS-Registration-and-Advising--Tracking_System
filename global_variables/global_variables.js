const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

  // Enrollment Details
  router.post('/api/global_variables/enrollment', async (req, res) => {
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const row1 = await database.get(db, `SELECT * FROM global_variables WHERE key = ?`, ['semester'], false)
      const row2 = await database.get(db, `SELECT * FROM global_variables WHERE key = ?`, ['acad_year'], false)
      res.json({semester: row1.value, acad_year: row2.value}).send()
    } catch (error) {
      console.log('Error in global_variables.js > api > global_variables > enrollment', error)
      res.status(401).json({message: error}).send()
    }
  })
  // end Enrollment Details

// end Routes

module.exports = {router}