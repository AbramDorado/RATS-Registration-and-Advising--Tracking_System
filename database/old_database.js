const sqlite3 = require('sqlite3').verbose()
const source = './database/db.sqlite'
const { v4: uuidv4 } = require('uuid');

// Open/Create Database
var db
async function openDB() {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('openDB called') // temp
      db = new sqlite3.Database(source, (err) => {
        if (err) {
          throw err
        } else {
          console.log('Connected to the SQLite database.')
          resolve()
        }
      })
    } catch (error) {
      console.error('Error opening/creating database in database.js') // temp
      console.error(error)
      reject()
    }
  })
}

// Create user table
async function createUserTable() {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('createUserTable called') // temp
      const res = await dbRun(`CREATE TABLE IF NOT EXISTS user (
        id TEXT UNIQUE PRIMARY KEY,
        role TEXT NOT NULL,
        up_mail TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL
      )`, [])
      resolve('createUserTable success')
    } catch (error) {
      console.log('Error on createUserTable') // temp
      reject('createUserTable failed')
    }
  })
}

// Calls
async function initialCalls() {
  await openDB()
  await createUserTable()
  await initialUsers()
}
// initialCalls()

async function initialUsers() {
  // console.log('initialUsers called') // temp
  // Insert initial users
  // student jmlicup@up.edu.ph
  try {
    dbRun(`INSERT INTO user (
      id,
      role,
      up_mail,
      first_name,
      last_name
    ) VALUES (?, ?, ?, ?, ?)`, [
      uuidv4(),
      'student',
      'jmlicup@up.edu.ph',
      'John Paolo',
      'Licup'
    ], true)
  } catch (error) {
    console.error('Error on inserting initial users.') // temp
    console.error(error) // temp
  }
  // adviser jpmlicup@gmail.com
  try {
    dbRun(`INSERT INTO user (
      id,
      role,
      up_mail,
      first_name,
      last_name
    ) VALUES (?, ?, ?, ?, ?)`, [
      uuidv4(),
      'adviser',
      'jpmlicup@gmail.com',
      'John Paolo',
      'Licup'
    ], true)
  } catch (error) {
    console.error('Error on inserting initial users.') // temp
    console.error(error) // temp
  }
  // admin jpmlicup10@gmail.com
  try {
    dbRun(`INSERT INTO user (
      id,
      role,
      up_mail,
      first_name,
      last_name
    ) VALUES (?, ?, ?, ?, ?)`, [
      uuidv4(),
      'admin',
      'jpmlicup10@gmail.com',
      'John Paolo',
      'Licup'
    ], true)
  } catch (error) {
    console.error('Error on inserting initial users.') // temp
    console.error(error) // temp
  }
  // end Insert initial users
}

// Functions

async function dbRun(sql, params, ignoreErrs) {
  // if ignoreErrs == true, no errors will be thrown
  return new Promise(async (resolve, reject) => {
    try {
      db.run(sql, params, (err) => {
        if (err) {
          if (!ignoreErrs) {
            throw err
          }
          // console.log('err ignored') // temp
          // throw err
        } else {
          resolve()
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

async function dbGet(sql, params, ignoreErrs) {
  // if ignoreErrs == true, no errors will be thrown
  return new Promise(async (resolve, reject) => {
    try {
      db.get(sql, params, (err, row) => {
        if (err) {
          if (!ignoreErrs) {
            throw err
          }
          // console.log('err ignored') // temp
          // throw err
        } else {
          resolve(row)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {initialCalls}

// Notes

// SQLite3 API
// https://github.com/TryGhost/node-sqlite3/wiki/API

// Useful tool for testing SQLite Commands
// https://sqliteonline.com/

// Different modes in opening db
// https://stackoverflow.com/questions/62864483/read-sqlite-database-with-node-js