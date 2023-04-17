const express = require('express')
const app = express()

// Main
async function main() {
  // Insert async calls here

    // Initialize dotenv
    require('dotenv').config()
    // end Initialize dotenv

    // Initialize body Parser
    const bodyParser = require('body-parser')
    app.use(bodyParser.json())
    // end Initialize body parser

    // Initialize database
    const source = './database/db.sqlite'
    const database = require('./database/database')
    const db = await database.openOrCreateDB(source)
    // end Initialize database

    // Initial database
    const initial = require('./database/initial')
    await initial.main(db)
    // end Initial database

    // Initialize passport auth and session
    const auth = require('./auth/auth')
    await auth.main(app, db)
    // end Initialize passport auth and session

    // Initialize routers
    const announcement = require('./announcement/announcement')
    app.use('/', announcement.router)
    const advising = require('./advising/advising')
    app.use('/', advising.router)
    const course = require('./course/course')
    app.use('/', course.router)
    const ecf = require('./advising/ecf')
    app.use('/', ecf.router)
    const global_variables = require('./global_variables/global_variables')
    app.use('/', global_variables.router)
    // end Initialize routers

    // Initialize fallback
    const history = require('connect-history-api-fallback')
    app.use(history())
    // end Initialize fallback

    // Serving frontend
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'dist')))
    // end Serve frontend

  // Start express server
  app.listen(8000, () => {
<<<<<<< HEAD
    console.log(`Express app listening on port ${process.env.PORT}`)
=======
    console.log(`Express app listening on port 8000`)
>>>>>>> main
  })
  // end Start express server
}
main() // Main Call
