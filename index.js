const express = require('express')
const app = express()
const port = 3000


// SQLite3 Database
const db = require('./database/database')

// Express Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
