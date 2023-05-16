/*
@dependencies
    uuid
*/

const { v4: uuidv4 } = require('uuid');

let database
let authDb

async function main(_database_, _authDb_) {

    database = _database_
    authDb = _authDb_

    await createTables()
    await createRows()

}

async function createTables() {

    // users table
    await database.createTable(authDb, 'users', `
        id TEXT UNIQUE PRIMARY KEY,
        role TEXT,
        up_mail TEXT UNIQUE,
        first_name TEXT,
        middle_name TEXT,
        last_name TEXT
    `)
    // end users table

}

async function createRows() {

    // users
    await database.run(authDb, `
        INSERT INTO users (
            id, role, up_mail, first_name, middle_name, last_name
        ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
        uuidv4(), 'admin', 'jmlicup@up.edu.ph', 'john paolo', 'mercado', 'licup'
    ], true)
    // end users

}

module.exports = { main }