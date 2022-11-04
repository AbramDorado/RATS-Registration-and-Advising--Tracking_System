const express = require('express')
const app = express()
const port = 3000

const database = require('./database/database')
const initial = require('./database/initial')
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

    // Routers
    app.use('/', auth.router)

  // Start express server
  app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
  })
}
main() // Main Call
