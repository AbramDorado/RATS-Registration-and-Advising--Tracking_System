const { v4: uuidv4 } = require('uuid');
const database = require('./database')

async function createInitialTables(db) {
  // user table
  await database.createTable(db, 'user', `
    id TEXT UNIQUE PRIMARY KEY,
    role TEXT,
    up_mail TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    degree_program TEXT,
    sais_id TEXT,
    student_number TEXT,
    adviser_up_mail TEXT,
    department TEXT
  `)
  // end user table
  // announcement table
  await database.createTable(db, 'announcement', `
    id TEXT UNIQUE PRIMARY KEY,
    title TEXT,
    body TEXT UNIQUE,
    created INTEGER,
    modified INTEGER
  `)
  // end announcement table
  // advising_status table
  await database.createTable(db, 'advising_status', `
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    adviser_up_mail TEXT,
    degree_program TEXT,
    department TEXT,
    step1_status TEXT,
    step2_status TEXT,
    step3_status TEXT
  `)
  // end advising_status table
  // course table
  await database.createTable(db, 'course', `
    class_number TEXT UNIQUE PRIMARY KEY,
    department TEXT,
    course_title TEXT,
    subject TEXT,
    catalog_no TEXT,
    section TEXT,
    component TEXT,
    schedule TEXT,
    learning_delivery_mode TEXT,
    room_assigned TEXT,
    instructor TEXT,
    class_capacity TEXT,
    restrictions TEXT,
    units TEXT
  `)
  // end course table
  // course_edit table
  await database.createTable(db, 'course_edit', `
    class_number TEXT UNIQUE PRIMARY KEY,
    subject TEXT,
    catalog_no TEXT,
    section TEXT,
    modification TEXT,
    last_modified TEXT
  `)
  // end course_edit table
  // curri_progress table
  await database.createTable(db, 'curri_progress', `
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    curri_progress TEXT,
    created TEXT,
    modified TEXT
  `)
  // end curri_progress table
  // ecf table
  await database.createTable(db, 'ecf', `
    id TEXT UNIQUE PRIMARY KEY,
    student_up_mail TEXT,
    class_number TEXT,
    adviser_up_mail TEXT
  `)
  // end ecf table
  // global_variables table
  await database.createTable(db, 'global_variables', `
    key TEXT UNIQUE PRIMARY KEY,
    value
  `)
  // end global_variables table
}

async function createInitialRows(db) {

  // Advising Status
    // student jmlicup@up.edu.ph
    await database.run(db, `
      INSERT OR REPLACE INTO advising_status (
        student_up_mail,
        adviser_up_mail,
        department,
        degree_program,
        step1_status,
        step2_status,
        step3_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['jmlicup@up.edu.ph', 'johnpaolomlicup@gmail.com', 'dpsm', 'BS Computer Science', 'not started', 'not started', 'no access'], true)
    // end student jmlicup@up.edu.ph
  // end Advising Status

  // Global Variables
    await database.run(db, `
      INSERT INTO global_variables (key, value) VALUES (?, ?)
    `, ['semester', 'Second'], true)
    await database.run(db, `
      INSERT INTO global_variables (key, value) VALUES (?, ?)
    `, ['acad_year', '2022-2023'], true)
  // end Global Variables

  // Users
    // student jmlicup@up.edu.ph
    await database.run(db, `
      INSERT OR REPLACE INTO user (
        id, role, up_mail, first_name, last_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      uuidv4(),
      'student', 'jmlicup@up.edu.ph', 'John Paolo', 'Licup', 'BS Computer Science', '10008', '2019-46188', 'vcmagboo@up.edu.ph', 'dpsm'
    ], true)
    // end student jmlicup@up.edu.ph
    // admin jpmlicup@gmail.com
    await database.run(db, `
      INSERT OR REPLACE INTO user (
        id, role, up_mail, first_name, last_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      uuidv4(),
      'admin', 'jpmlicup@gmail.com', 'John Paolo', 'Licup', '', '', '', '', ''
    ], true)
    // end admin jpmlicup@gmail.com
  // end Users


}

module.exports = {createInitialTables, createInitialRows}