/*
@dependencies
    
*/

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
        last_name TEXT
    `)
    // end users table

}

async function createRows() {

}

module.exports = { main }