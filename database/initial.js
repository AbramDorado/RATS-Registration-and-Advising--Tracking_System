const { v4: uuidv4 } = require('uuid');
const database = require('./database')

async function createInitialTables(db) {
  // user table
  await database.createTable(db, 'user', `
    id TEXT UNIQUE PRIMARY KEY,
    role TEXT,
    up_mail TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT
  `)
}

async function createInitialRows(db) {
  // users
  // student jmlicup@up.edu.ph
  await database.run(db, `
    INSERT INTO user (
      id, role, up_mail, first_name, last_name
    ) VALUES (
      ?, ?, ?, ?, ?
    )
  `, [
    uuidv4(),
    'student', 'jmlicup@up.edu.ph', 'John Paolo', 'Licup'
  ], true)
  // admin jpmlicup@gmail.com
  await database.run(db, `
    INSERT INTO user (
      id, role, up_mail, first_name, last_name
    ) VALUES (
      ?, ?, ?, ?, ?
    )
  `, [
    uuidv4(),
    'admin', 'jpmlicup@gmail.com', 'John Paolo', 'Licup'
  ], true)
}

module.exports = {createInitialTables, createInitialRows}