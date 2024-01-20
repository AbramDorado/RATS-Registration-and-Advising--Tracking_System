const express = require('express')
const app = express()
const morgan = require('morgan')

// Main
async function main() {
  console.log('Starting server...');
  // Insert async calls here

  // Initialize dotenv
  require('dotenv').config()
  // end Initialize dotenv

  // Initialize body Parser
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  // end Initialize body parser
  app.use(morgan('dev'))
  // Initialize database
  // const source = './database/db.sqlite'
  const database = require('./database/database');
  const db = await database.openOrCreateDB();
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
  const grade = require('./grade/grade')
  app.use('/', grade.router)
  const curriculum = require("./curriculum/curriculum");
  app.use("/", curriculum.router);
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
  // const ip = '172.16.120.169'
  // if (ip) {
  //   app.listen(8000, ip, () => {
  //     console.log(`Express app listening on port ${8000} exposed to IP ${ip}`)
  //   })
  // } else {
  //   app.listen(8000, () => {
  //     console.log(`Express app listening on port 8000`)
  //   })
  // }

  // app.listen(8000, () => {
  //   console.log(`Express app listening on port 8000`)
  // })

  //port for railway deployment
  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Express app listening on port ${port}`);
  });


  // end Start express server
}
main() // Main Call
