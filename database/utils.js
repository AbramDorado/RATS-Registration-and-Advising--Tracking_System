// Utility functions for SQLite3 Database

const sqlite3 = require('sqlite3').verbose()

// Open/Create Database
var db
async function openDB() {
  try {
    db = new sqlite3.Database('./database/db.sqlite', (err) => {
      if (err) {
        throw err
      } else {
        // console.log('Connected to the SQLite database.') // temp
      }
    })
  } catch (error) {
    console.error('Error opening/creating database in database.js') // temp
    console.error(error)
  }
}

// Functions
async function dbRun(sql, params) {
  return new Promise( async (resolve, reject) => {
    try {
      await openDB()
      db.run(sql, params, (err) => {
        if (err) {
          throw err
        } else {
          resolve()
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {dbRun}