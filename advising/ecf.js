const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

// Create
// router.post('/api/ecf/create', studentOnly, async (req, res) => {
//   // req.body = {student_up_mail, class_number, adviser_up_mail}
//   try {
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     // await database.run(db, `
//     //     INSERT OR REPLACE INTO ecf (
//     //       id,
//     //       student_up_mail,
//     //       class_number,
//     //       adviser_up_mail
//     //     ) VALUES (?, ?, ?, ?)
//     //   `, [req.user.up_mail + req.body.class_number, req.user.up_mail, req.body.class_number, req.body.adviser_up_mail], false)
//     await client.query(`
//   INSERT INTO ecf (id, student_up_mail, class_number, adviser_up_mail)
//   VALUES ($1, $2, $3, $4)
//   ON CONFLICT (id) DO UPDATE
//   SET student_up_mail = EXCLUDED.student_up_mail,
//       class_number = EXCLUDED.class_number,
//       adviser_up_mail = EXCLUDED.adviser_up_mail
// `, [req.user.up_mail + req.body.class_number, req.user.up_mail, req.body.class_number, req.body.adviser_up_mail]);
//     // // update advising_status
//     // await database.run(db, `UPDATE advising_status SET step2_status = ? WHERE student_up_mail = ?`, ['waiting for approval', req.user.up_mail], false)
//     await client.query(`
//   UPDATE advising_status
//   SET step2_status = $1
//   WHERE student_up_mail = $2
// `, ['waiting for approval', req.user.up_mail]);



//     res.json({ message: `Added ${req.body.class_number} to student ${req.body.student_up_mail}'s ECF with adviser ${req.body.adviser_up_mail}` }).send()
//   } catch (error) {
//     console.log('Error on api > ecf > create', error)
//     res.status(401).json({ message: error }).send()
//   }
// })

// Create
router.post('/api/ecf/create', studentOnly, async (req, res) => {
  // req.body = {student_up_mail, class_number, adviser_up_mail}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    // Query to insert or replace a record into the "ecf" table
    const ecfQuery = {
      text: `
        INSERT INTO "ecf" ("id", "student_up_mail", "class_number", "adviser_up_mail")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("id") DO UPDATE
        SET "student_up_mail" = EXCLUDED."student_up_mail",
            "class_number" = EXCLUDED."class_number",
            "adviser_up_mail" = EXCLUDED."adviser_up_mail"
      `,
      values: [req.user.up_mail + req.body.class_number, req.user.up_mail, req.body.class_number, req.body.adviser_up_mail],
    };

    await client.query(ecfQuery);

    // Query to update the "advising_status" table
    const advisingStatusQuery = {
      text: `
        UPDATE "advising_status"
        SET "step2_status" = $1
        WHERE "student_up_mail" = $2
      `,
      values: ['waiting for approval', req.user.up_mail],
    };

    await client.query(advisingStatusQuery);

    res.json({ message: `Added ${req.body.class_number} to student ${req.body.student_up_mail}'s ECF with adviser ${req.body.adviser_up_mail}` }).send();
    await client.release();
  } catch (error) {
    console.error('Error on api > ecf > create', error);
    res.status(401).json({ message: error }).send();
  }
});
// end Create

// // Read All Rows from Student
// router.post('/api/ecf/read/all/student', studentOrOCSOnly, async (req, res) => {
//   // req.body = {student_up_mail}
//   try {
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     const ecf_rows = await client.query('SELECT * FROM ecf WHERE student_up_mail = $1', [req.body.student_up_mail]);

//     const ecf_complete_rows = [];

//     for (let i = 0; i < ecf_rows.rows.length; i++) {
//       const row = await client.query('SELECT * FROM course WHERE class_number = $1', [ecf_rows.rows[i].class_number]);
//       ecf_complete_rows.push(row.rows);
//     }

//     res.json({ rows: ecf_complete_rows });
//   } catch (error) {
//     console.error('Error on api > ecf > read > all > student', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// })


router.post('/api/ecf/read/all/student', studentOrOCSOnly, async (req, res) => { //**** */
  let client;
  // req.body = {student_up_mail}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const ecfRowsQuery = {
        text: `
          SELECT * FROM ecf WHERE student_up_mail = $1
        `,
        values: [req.body.student_up_mail],
      };
      const ecfRows = await client.query(ecfRowsQuery);

      const ecfCompleteRows = [];
      for (let i = 0; i < ecfRows.rows.length; i++) {
        const courseRowQuery = {
          text: `
            SELECT * FROM course WHERE class_number = $1
          `,
          values: [ecfRows.rows[i].class_number],
        };
        const courseRow = await client.query(courseRowQuery);
        ecfCompleteRows.push(courseRow.rows[0]);
      }

      res.json({ rows: ecfCompleteRows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > ecf > read > all > student', error);
    res.status(401).json({ message: error }).send();
  }
});

// end Read All from Student

// Read All from Student Using Adviser Account
// router.post('/api/ecf/read/all/student/adviserAcc', adviserOnly, async (req, res) => {
//   // required body: {student_up_mail}
//   try {
//     // const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     // const ecf_rows = await database.all(db, `
//     //     SELECT * FROM ecf WHERE student_up_mail = ?
//     //   `, [req.body.student_up_mail], false)

//     const ecf_rows = await client.query(`
//   SELECT * FROM ecf WHERE student_up_mail = $1
// `, [req.body.student_up_mail]);

//     var ecf_complete_rows = []
//     for (let i = 0; i < ecf_rows.length; i++) {
//       // const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [ecf_rows[i].class_number], false)
//       const row = await client.query(`
//   SELECT * FROM course WHERE class_number = $1
// `, [ecf_rows[i].class_number]);

//       ecf_complete_rows.push(row)
//     }
//     res.json({ rows: ecf_complete_rows }).send()
//   } catch (error) {
//     console.log('Error on api > ecf > read > all > student > adviserAcc', error)
//     res.status(401).json({ message: error }).send()
//   }
// })


router.post('/api/ecf/read/all/student/adviserAcc', adviserOnly, async (req, res) => { //**** */
  let client;
  // required body: {student_up_mail}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const ecfRowsQuery = {
        text: `
          SELECT * FROM ecf WHERE student_up_mail = $1
        `,
        values: [req.body.student_up_mail],
      };
      const ecfRows = await client.query(ecfRowsQuery);
      console.log('ecfRows', ecfRows);

      const ecfCompleteRows = [];
      for (let i = 0; i < ecfRows.rows.length; i++) {
        console.log('ecfRows.rows[i].class_number', ecfRows.rows[i].class_number);
        const courseRowQuery = {
          text: `
            SELECT * FROM course WHERE class_number = $1
          `,
          values: [ecfRows.rows[i].class_number],
        };
        const courseRow = await client.query(courseRowQuery);
        console.log('courseRow.rows[0]', courseRow.rows[0]);
        ecfCompleteRows.push(courseRow.rows[0]);
      }
      console.log('ecfCompleteRows', ecfCompleteRows);
      res.json({ rows: ecfCompleteRows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > ecf > read > all > student > adviserAcc', error);
    res.status(401).json({ message: error }).send();
  }
});
// end Read All from Student Using Adviser Account

// Read All from Student Using OCS Account
// router.post('/api/ecf/read/all/student/ocsAcc', ocsOnly, async (req, res) => {
//   // required body: {student_up_mail}
//   try {
//     // const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     // const ecf_rows = await database.all(db, `
//     //     SELECT * FROM ecf WHERE student_up_mail = ?
//     //   `, [req.body.student_up_mail], false)
//     const ecf_query = {
//       text: `
//         SELECT * FROM ecf WHERE student_up_mail = $1
//       `,
//       values: [req.body.student_up_mail],
//     };

//     const ecf_rows = await client.query(ecf_query);
//     var ecf_complete_rows = []
//     for (let i = 0; i < ecf_rows.length; i++) {
//       // const row = await database.get(db, `SELECT * FROM course WHERE class_number = ?`, [ecf_rows[i].class_number], false)
//       const row_query = {
//         text: `
//           SELECT * FROM course WHERE class_number = $1
//         `,
//         values: [ecf_rows[i].class_number],
//       };

//       const row = await client.query(row_query);

//       // row_result.rows contains the result rows (in this case, a single row)

//       ecf_complete_rows.push(row)
//     }
//     res.json({ rows: ecf_complete_rows }).send()
//   } catch (error) {
//     console.log('Error on api > ecf > read > all > student > ocsAcc', error)
//     res.status(401).json({ message: error }).send()
//   }
// })

router.post('/api/ecf/read/all/student/ocsAcc', ocsOnly, async (req, res) => { //**** */
  let client;
  // required body: {student_up_mail}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const ecfRowsQuery = {
        text: `
          SELECT * FROM ecf WHERE student_up_mail = $1
        `,
        values: [req.body.student_up_mail],
      };
      const ecfRows = await client.query(ecfRowsQuery);
      console.log('ecfRows', ecfRows);

      const ecfCompleteRows = [];
      for (let i = 0; i < ecfRows.rows.length; i++) {
        console.log('ecfRows.rows[i].class_number', ecfRows.rows[i].class_number);
        const courseRowQuery = {
          text: `
            SELECT * FROM course WHERE class_number = $1
          `,
          values: [ecfRows.rows[i].class_number],
        };
        const courseRow = await client.query(courseRowQuery);
        console.log('courseRow.rows[0]', courseRow.rows[0]);
        ecfCompleteRows.push(courseRow.rows[0]);
      }
      console.log('ecfCompleteRows', ecfCompleteRows);
      res.json({ rows: ecfCompleteRows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > ecf > read > all > student > ocsAcc', error);
    res.status(401).json({ message: error }).send();
  }
});

// end Read All from Student Using OCS Account

// Read All Rows from Student And from Adviser
// router.post('/api/ecf/read/all/adviser', adviserOnly, async (req, res) => {
//   // req.body = {student_up_mail}
//   try {
//     // const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     // Extracting filter parameters from request body
//     var myOffset = 0
//     if (req.body.offset) {
//       myOffset = req.body.offset
//     }
//     var myLimit = 50
//     if (req.body.limit) {
//       myLimit = req.body.limit
//     }
//     var sortColumn = 'user.degree_program'
//     if (req.body.sortColumn) {
//       sortColumn = `user.${req.body.sortColumn}`
//     }
//     var sortOrder = 'ASC'
//     if (req.body.sortOrder) {
//       sortOrder = req.body.sortOrder
//     }
//     var searchString = ''
//     if (req.body.searchString) {
//       searchString = req.body.searchString
//     }
//     var filterByCurriculumProgress = ''
//     if (req.body.curriculumProgress) {
//       filterByCurriculumProgress = `AND advising_status.step1_status = '${req.body.curriculumProgress}'`
//     }
//     var filterByAdvisingStatus = ''
//     if (req.body.advisingStatus) {
//       filterByAdvisingStatus = `AND advising_status.step2_status = '${req.body.advisingStatus}'`
//     }

//     // Modifying query to include filter parameters
//     const rows = await database.all(`
//         SELECT
//           user.up_mail, user.first_name, user.last_name, user.middle_name, user.degree_program, user.sais_id, user.student_number, advising_status.step1_status, advising_status.step2_status
//         FROM user INNER JOIN advising_status
//           ON user.up_mail = advising_status.student_up_mail
//         WHERE user.adviser_up_mail = ?
//           AND (user.degree_program LIKE '%${searchString}%'
//           OR user.up_mail LIKE '%${searchString}%'
//           OR user.first_name LIKE '%${searchString}%'
//           OR user.last_name LIKE '%${searchString}%')
//           ${filterByCurriculumProgress}
//           ${filterByAdvisingStatus}
//         ORDER BY ${sortColumn} ${sortOrder}
//         LIMIT ${myLimit}
//         OFFSET ${myOffset}`, [req.user.up_mail])
//     res.json({ rows: rows }).send()
//   } catch (error) {
//     console.log('Error on api > ecf > read > all > adviser', error)
//     res.status(401).json({ message: error }).send()
//   }
// })
// end Read All Rows from Student And from Adviser

router.post('/api/ecf/read/all/adviser', adviserOnly, async (req, res) => {
  // req.body = {student_up_mail}
  let client;
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      // Extracting filter parameters from request body
      const myOffset = req.body.offset || 0;
      const myLimit = req.body.limit || 50;
      const sortColumn = req.body.sortColumn || 'degree_program'; // Default sort column
      const sortOrder = req.body.sortOrder || 'ASC'; // Default sort order
      const searchString = req.body.searchString || '';
      const filterByCurriculumProgress = req.body.curriculumProgress ? `AND advising_status.step1_status = '${req.body.curriculumProgress}'` : '';
      const filterByAdvisingStatus = req.body.advisingStatus ? `AND advising_status.step2_status = '${req.body.advisingStatus}'` : '';

      // Create the query with dynamic column names

      const readAllAdviserECFQuery = {
        text: `
          SELECT
            "user"."up_mail", "user"."first_name", "user"."last_name", "user"."middle_name", "user"."degree_program", "user"."sais_id", "user"."student_number", "advising_status"."step1_status", "advising_status"."step2_status"
          FROM "user" INNER JOIN "advising_status"
            ON "user"."up_mail" = "advising_status"."student_up_mail"
          WHERE "user"."adviser_up_mail" = $1
            AND ("user"."degree_program" ILIKE '%' || $2 || '%'
            OR "user"."up_mail" ILIKE '%' || $2 || '%'
            OR "user"."first_name" ILIKE '%' || $2 || '%'
            OR "user"."last_name" ILIKE '%' || $2 || '%')
            ${filterByCurriculumProgress}
            ${filterByAdvisingStatus}
          ORDER BY "${sortColumn}" ${sortOrder}
          LIMIT $3
          OFFSET $4
        `,
        values: [req.user.up_mail, searchString, myLimit, myOffset],
      };
      const result = await client.query(readAllAdviserECFQuery);
      res.json({ rows: result.rows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > ecf > read > all > adviser', error);
    res.status(401).json({ message: error }).send();
  }
});


// Read All (Student Details, Advising Status, ECF Data) from Student Using OCS Account
router.post('/api/ecf/read/all/OCS', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    var myOffset = 0;
    console.log('req.body.offset', req.body.offset);
    if (req.body.offset) {
      // myOffset = req.body.offset
    }
    var myLimit = 50
    if (req.body.limit) {
      myLimit = req.body.limit
    }
    var sortColumn = 'last_name'
    if (req.body.sortColumn) {
      sortColumn = `user.${req.body.sortColumn}`
    }
    var sortOrder = 'ASC'
    if (req.body.sortOrder) {
      sortOrder = req.body.sortOrder
    }
    var searchString = ''
    if (req.body.searchString) {
      searchString = req.body.searchString
    }
    var filterByCurriculumProgress = ''
    if (req.body.curriculumProgress) {
      filterByCurriculumProgress = `AND advising_status.step1_status = '${req.body.curriculumProgress}'`
    }
    var filterByAdvisingStatus = ''
    if (req.body.advisingStatus) {
      filterByAdvisingStatus = `AND advising_status.step2_status = '${req.body.advisingStatus}'`
    }

    // Modifying query to include filter parameters
    // const rows = await database.all(db, `
    //     SELECT
    //       user.up_mail, user.first_name, user.last_name, user.middle_name, user.degree_program, user.sais_id, user.student_number, user.adviser_up_mail, user.department, advising_status.step1_status, advising_status.step2_status
    //     FROM user INNER JOIN advising_status
    //       ON user.up_mail = advising_status.student_up_mail
    //     WHERE user.role = ?
    //       AND (user.degree_program LIKE '%${searchString}%'
    //       OR user.up_mail LIKE '%${searchString}%'
    //       OR user.first_name LIKE '%${searchString}%'
    //       OR user.last_name LIKE '%${searchString}%')
    //       ${filterByCurriculumProgress}
    //       ${filterByAdvisingStatus}
    //     ORDER BY ${sortColumn} ${sortOrder}
    //     LIMIT ${myLimit}
    //     OFFSET ${myOffset}`, ['student'], false)


    const query = {
      text: `
        SELECT
          "user"."up_mail", "user"."first_name", "user"."last_name", "user"."middle_name", "user"."degree_program", "user"."sais_id", "user"."student_number", "user"."adviser_up_mail", "user"."department", "advising_status"."step1_status", "advising_status"."step2_status"
        FROM "user"
        INNER JOIN advising_status ON "user"."up_mail" = "advising_status"."student_up_mail"
        WHERE "user"."role" = $1
          AND (
            "user"."degree_program" ILIKE $2
            OR "user"."up_mail" ILIKE $2
            OR "user"."first_name" ILIKE $2
            OR "user"."last_name" ILIKE $2
          )
          ${filterByCurriculumProgress}
          ${filterByAdvisingStatus}
        ORDER BY $3 ${sortOrder}
        LIMIT $4
        OFFSET $5
      `,
      values: ['student', `%${searchString}%`, sortColumn, myLimit, myOffset],
    };

    const { rows } = await client.query(query);

    // const rows = await database.all(db, `
    //   SELECT
    //     user.up_mail, user.first_name, user.last_name, user.middle_name, user.degree_program, user.sais_id, user.student_number, user.adviser_up_mail, user.department, advising_status.step1_status, advising_status.step2_status
    //   FROM user INNER JOIN advising_status
    //     ON user.up_mail = advising_status.student_up_mail
    //   WHERE user.role = ?
    // `, ['student'], false)
    res.json({ rows: rows }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > ecf > read > all > OCS', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Read All (Student Details, Advising Status, ECF Data) from Student Using OCS Account

// Delete One
router.post('/api/ecf/delete', studentOnly, async (req, res) => {
  // req.body = {class_number}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    // await database.run(db, `DELETE FROM ecf WHERE student_up_mail = ? AND class_number = ?`, [req.user.up_mail, req.body.class_number], false)
    await client.query(`DELETE FROM ecf WHERE student_up_mail = $1 AND class_number = $2`, [req.user.up_mail, req.body.class_number]);
    // update advising_status
    // await database.run(db, `UPDATE advising_status SET step2_status = ? WHERE student_up_mail = ?`, ['waiting for approval', req.user.up_mail], false)
    await client.query(`
  UPDATE advising_status
  SET step2_status = $1
  WHERE student_up_mail = $2
`, ['waiting for approval', req.user.up_mail]);

    res.json({ message: `Delete ecf row for student ${req.user.up_mail} with class number ${req.body.class_number}` }).send()
    await client.release();
  } catch (error) {
    console.log('Error on api > ecf > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Delete One

// Delete All
router.post('/api/ecf/delete/all', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query(`DELETE FROM ecf`);
    res.json({ message: 'Deleted all rows from ecf successfully' }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > ecf > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Delete All

router.post('/api/ecf/countAdvisees', adviserOrOCSOnly, async (req, res) => {
  try {
    var filterByCurriculumProgress = ''
    if (req.body.curriculumProgress) {
      filterByCurriculumProgress = `AND ("advising_status"."step1_status" = '${req.body.curriculumProgress}')`
    }
    var filterByAdvisingStatus = ''
    if (req.body.advisingStatus) {
      filterByAdvisingStatus = `AND ("advising_status"."step2_status" = '${req.body.advisingStatus}')`
    }
    var adviserText = ''
    if (req.user.role === 'adviser') {
      adviserText = `AND ("user"."adviser_up_mail" = '${req.user.up_mail}')`
    }
    const adviserUPMail = req.user.up_mail // get the id of the current adviser
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const rows = await client.query(`
    SELECT COUNT(*) AS count
    FROM "user"
    INNER JOIN "advising_status" ON "user"."up_mail" = "advising_status"."student_up_mail"
    WHERE ("user"."role" = 'student') ${adviserText} ${filterByCurriculumProgress} ${filterByAdvisingStatus}
  `);

    res.json({ 'count': rows.rows[0].count }).send();
    await client.release();
  } catch (error) {
    console.log('error on /api/countAdvisees')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
})








// end Routes

// Middlewares
function adviserOnly(req, res, next) {
  try {
    if (req.user.role !== 'adviser') {
      throw 'User not Adviser'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on advising.js > adviserOnly', error)
    res.status(401).json({ message: error }).send()
  }
}
function adviserOrOCSOnly(req, res, next) {
  try {
    console.log('role', req.user.role);
    if (req.user.role === 'adviser' || req.user.role === 'ocs') {
      next()
    } else {
      throw 'Not adviser nor OCS'
    }
  } catch (error) {
    console.log('Error on advising.js > adviserOrOCSOnly', error)
    res.status(401).json({ message: error }).send()
  }
}
function loggedIn(req, res, next) {
  try {
    if (!req.user) {
      throw 'User not logged in'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error in advising.js > loggedIn middleware')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
}
function ocsOnly(req, res, next) {
  try {
    if (req.user.role !== 'ocs') {
      throw 'User not OCS'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on advising.js > OcsOnly', error)
    res.status(401).json({ message: error }).send()
  }
}
function studentOnly(req, res, next) {
  try {
    if (req.user.role !== 'student') {
      throw 'User is not student'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on advising.js > studentOnly()')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
}
function studentOrOCSOnly(req, res, next) {
  try {
    if (req.user.role === 'student' || req.user.role === 'ocs') {
      next()
    } else {
      throw 'Not student nor OCS'
    }
  } catch (error) {
    console.log('Error on advising.js > studentOrOCSOnly()')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
}
// end Middlewares

module.exports = { router }