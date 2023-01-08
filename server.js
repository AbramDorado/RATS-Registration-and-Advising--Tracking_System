const express = require('express')
const app = express()
const port = 8000

const advising = require('./advising/advising')
const course = require('./course/course')
const database = require('./database/database')
const ecf = require('./advising/ecf')
const global_variables = require('./global_variables/global_variables')
const initial = require('./database/initial')
const announcement = require('./announcement/announcement')
const auth = require('./auth/auth')

// Main
async function main() {
  // Insert async calls here

    // Create db.sqlite Database
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    // end Create db.sqlite Database

    // Initial
    await initial.createInitialTables(db)
    await initial.createInitialRows(db)
    // end Initial

    // Passport Auth and Session
    await auth.main(app)
    await auth.configureGoogleStrategy(db)
    // end Passport Auth and Session

    // Body Parser
    const bodyParser = require('body-parser')
    app.use(bodyParser.json())

    // Cookie Parser
    const cookieParser = require('cookie-parser')
    app.use(cookieParser())

    // Routers
    app.use('/', auth.router)
    app.use('/', announcement.router)
    app.use('/', advising.router)
    app.use('/', course.router)
    app.use('/', ecf.router)
    app.use('/', global_variables.router)

    // HTML Middleware
    const history = require('connect-history-api-fallback')
    app.use(history())

    // Serving Frontend
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'dist'))) // added

  // Start express server
  app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
  })
}
main() // Main Call
