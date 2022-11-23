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
  // end user table
  // announcement table
  await database.createTable(db, 'announcement', `
    id TEXT UNIQUE PRIMARY KEY,
    title TEXT,
    body TEXT UNIQUE,
    created TEXT,
    modified TEXT
  `)
  // end announcement table
  // advising_status table
  await database.createTable(db, 'advising_status', `
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    adviser_up_mail TEXT,
    step1_status TEXT,
    step2_status TEXT,
    step3_status TEXT
  `)
  // end advising_status table
}

async function createInitialRows(db) {

  // Advising Status
    // student jmlicup@up.edu.ph
    await database.run(db, `
      INSERT INTO advising_status (
        student_up_mail,
        adviser_up_mail,
        step1_status,
        step2_status,
        step3_status
      ) VALUES (?, ?, ?, ?, ?)
    `, ['jmlicup@up.edu.ph', 'johnpaolomlicup@gmail.com', 'not started', 'not started', 'no access'], true)
    // end student jmlicup@up.edu.ph
  // end Advising Status

  // Announcements
    await database.run(db, `
    INSERT INTO announcement (
      id, title, body, created, modified
    ) VALUES (?, ?, ?, ?, ?)
  `, [
    uuidv4(), 'Hello World!', 'Lorem ipsum dolor', Date.now(), Date.now()
  ], true)
  // end Announcements

  // Users
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
    // end student jmlicup@up.edu.ph
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
    // end admin jpmlicup@gmail.com
    // adviser johnpaolomlicup@gmail.com
    await database.run(db, `
      INSERT INTO user (
        id, role, up_mail, first_name, last_name
      ) VALUES (
        ?, ?, ?, ?, ?
      )
    `, [
      uuidv4(),
      'adviser', 'johnpaolomlicup@gmail.com', 'John Paolo', 'Licup'
    ], true)
    // end adviser johnpaolomlicup@gmail.com
  // end Users


}

module.exports = {createInitialTables, createInitialRows}