const sqlite3 = require('sqlite3').verbose()
const source = './database/db.sqlite'
const utils = require('./utils')

// Open/Create Database
try {
  const db = new sqlite3.Database(source, (err) => {
    if (err) {
      throw err
    } else {
      console.log('Connected to the SQLite database.')
    }
  })
} catch (error) {
  console.error('Error opening/creating database in database.js') // temp
  console.error(error)
}

// Create user table
try {
  utils.dbRun(`CREATE TABLE IF NOT EXISTS user (
    id text UNIQUE PRIMARY KEY,
    role text NOT NULL,
    up_mail text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
  )`, [])
} catch (error) {
  console.error('Error on creating user table.') // temp
  console.error(error) // temp
}

// Insert initial rows
const initial = require('./initial')

// Notes

// SQLite3 API
// https://github.com/TryGhost/node-sqlite3/wiki/API

// Useful tool for testing SQLite Commands
// https://sqliteonline.com/

// Different modes in opening db
// https://stackoverflow.com/questions/62864483/read-sqlite-database-with-node-js