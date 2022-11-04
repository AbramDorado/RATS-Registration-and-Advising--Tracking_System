// const db = 'my database'

// console.log('hello')
const sqlite3 = require('sqlite3').verbose()
const source = './database/db2.sqlite'
const db = new sqlite3.Database(source, (err) => {
  if (err) {
    throw err
  } else {
    console.log('Connected to the SQLite database.')
  }
})

module.exports = {db}