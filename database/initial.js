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
    restrictions TEXT
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
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    class_number TEXT,
    adviser_up_mail TEXT
  `)
  // end ecf table
}

async function createInitialRows(db) {

  // Advising Status
    // student jmlicup@up.edu.ph
    await database.run(db, `
      INSERT INTO advising_status (
        student_up_mail,
        adviser_up_mail,
        department,
        degree_program,
        step1_status,
        step2_status,
        step3_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['jmlicup@up.edu.ph', 'johnpaolomlicup@gmail.com', 'DPSM', 'BS Computer Science', 'not started', 'not started', 'no access'], true)
    // end student jmlicup@up.edu.ph
  // end Advising Status

  // Course
  // await database.run(db, `
  //   INSERT INTO course (
  //     class_number,
  //     department,
  //     course_title,
  //     subject,
  //     catalog_no,
  //     section,
  //     schedule,
  //     learning_delivery_mode,
  //     instructor,
  //     class_capacity,
  //     restrictions,
  //     was_edited
  //   ) VALUES (
  //     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  //   )
  // `, [
  //   '1000',
  //   'DAC',
  //   'COMM 10 Title',
  //   'COMM',
  //   '10',
  //   'LEC1',
  //   'MTH 7:00am-8:30am',
  //   'BLENDED',
  //   'Ogatis',
  //   '20',
  //   'First Year OrCom',
  //   'true'
  // ], true)
  // end Course

  // Course_Edit
  // await database.run(db, `
  //     INSERT INTO course_edit (
  //       class_number,
  //       last_modified
  //     ) VALUES (?, ?)
  // `, [
  //   '1000',
  //   Date.now()
  // ], true)
  // end Course_Edit

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