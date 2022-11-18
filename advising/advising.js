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
        SELECT status FROM advising_status WHERE student_up_mail = ?
      `, [req.body.student_up_mail], false)
      res.json({result: result}).send()
    }
  } catch (error) {
    console.log('Error in api advising getStatus')
    console.log(error)
    res.json({messsage: error}).send()
  }
})
// end Get Status


// Middlewares
function loggedIn(req, res, next) {
  try {
    if (!req.user) {
      throw 'User not logged in'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error in advising.js > loggedIn middlware')
    console.log(error)
    res.json({message: error}).send()
  }
}
// end Middlewares

module.exports = {router}