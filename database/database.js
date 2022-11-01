const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "./database/db.sqlite"

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error('Cannot open database') // temp
    console.error(err.message) // temp
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    // db.run(`CREATE TABLE IF NOT EXISTS instructor (
    //   instructor_id text UNIQUE PRIMARY KEY, 
    //   first_name text,
    //   last_name text,
    //   middle_name text,
    //   department text,
    //   courses_taught_array text,
    //   CONSTRAINT instructor_id_unique UNIQUE (instructor_id)
    //   )`,
    //   (err) => {
    //     if (err) {
    //       // console.log('error creating table instructor', err)
    //     } else {
    //       // Table just created, creating some rows
    //       // console.log('creating rows for instructor')
    //       var insert = 'INSERT INTO instructor (instructor_id, first_name, last_name, middle_name, department, courses_taught_array) VALUES (?,?,?,?,?,?)'
    //       db.run(insert, ["mamagboo@up.edu.ph","ma. sheila","magboo","abad","dpsm","['12345','12346']"], (err) => {
    //         if (err) {
    //           // console.log('error inserting rows to table instructor', err)
    //         } else {
    //           // console.log('inserted rows to table instructor')
    //         }
    //       })
    //     }
    //   }
    // );
  }
});
