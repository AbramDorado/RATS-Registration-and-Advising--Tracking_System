
const { Pool } = require('pg');

// Create a PostgreSQL pool
// const pool = new Pool({
//   user: 'postgres',
//   host: '127.0.0.1',
//   database: 'rats7', //you can change this base on your db
//   password: 'abrampostgres', //you can change this base on your db
//   port: 5432, // Default PostgreSQL port
// });

// Postgres connection in railway
const pool = new Pool({
  user: 'postgres',
  host: 'roundhouse.proxy.rlwy.net',
  database: 'railway',
  password: 'cbfd6cCA5Cd4DfB-cb2aB-b21ad1E-C6',
  port: '26226',
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate validation for Railway
  },
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

module.exports = { openOrCreateDB, createTable, run, get, all };
