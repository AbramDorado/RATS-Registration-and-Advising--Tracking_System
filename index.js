const express = require('express')
const app = express()
const port = 3000

// Test Module
const test = require('./test')
console.log(test) // temp

// SQLite3 Database
const db = require('./database/database')
async function openDB() {
  await db.initialCalls()
}

// Cookie Parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Auth and Session
const passport = require('passport')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const auth = require('./auth/auth')
app.use(session({
  secret: 'zrfvnzr',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'session.db', dir: './database' })
}))
app.use(passport.initialize())
app.use(passport.session())

// Routes
const authRouter = require('./auth/auth')
app.use('/', authRouter)

// Main
async function main() {
  // Open Database
  await openDB()
  // Express Server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
// main()

