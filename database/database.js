
const { Pool } = require('pg');

// // Create a PostgreSQL pool
// const pool = new Pool({
//   user: 'postgres',
//   host: '127.0.0.1',
//   database: 'rats6', //you can change this base on your db
//   password: 'abrampostgres', //you can change this base on your db
//   port: 5432, // Default PostgreSQL port
// });

// The secret connection string you copied earlier
const connectionString =
  "postgresql://postgres:dr75i6HaC0sDZDTjtLCt@containers-us-west-37.railway.app:6233/railway";

const pool = new Pool({
  connectionString,
});


// Open/Create Database
async function openOrCreateDB() {
  return pool;
}

// Create Table
async function createTable(db, tableName, columns) {
  const client = await pool.connect();
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columns})`;
    await client.query(createTableQuery);
  } finally {
    client.release();
  }
}


// Run SQL Command
async function run(sql, params, ignoreErrs) {
  const client = await pool.connect();
  try {
    await client.query(sql, params);
    return;
  } catch (err) {
    if (!ignoreErrs) {
      console.error(err);
      throw err;
    }
  } finally {
    client.release();
  }
}

// Get SQL Query
async function get(sql, params, ignoreErrs) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (err) {
    if (!ignoreErrs) {
      console.error(err);
      throw err;
    }
  } finally {
    client.release();
  }
}

// All SQL Query
async function all(sql, params, ignoreErrs) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } catch (err) {
    if (!ignoreErrs) {
      console.error(err);
      throw err;
    }
  } finally {
    client.release();
  }
}

module.exports = { openOrCreateDB, createTable, run, get, all, pool };
