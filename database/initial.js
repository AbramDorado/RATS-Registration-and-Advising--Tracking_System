// Contains scripts for inserting initial rows to database

const utils = require('./utils')
const { v4: uuidv4 } = require('uuid');

// Insert initial users
// student jmlicup@up.edu.ph
try {
  utils.dbRun(`INSERT INTO user (
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
  utils.dbRun(`INSERT INTO user (
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
  utils.dbRun(`INSERT INTO user (
    id,
    role,
    up_mail,
    first_name,
    last_name
  ) VALUES (?, ?, ?, ?, ?)`, [
    uuidv4(),
    'adviser',
    'jpmlicup10@gmail.com',
    'John Paolo',
    'Licup'
  ], true)
} catch (error) {
  console.error('Error on inserting initial users.') // temp
  console.error(error) // temp
}
// end Insert initial users