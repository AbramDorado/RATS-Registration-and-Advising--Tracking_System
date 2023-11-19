const database = require('../database/database')
const express = require('express')
const router = express.Router()

// Routes

// course APIs
// create
// router.post('/api/course/create', ocsOnly, async (req, res) => {
//   // req.body: {register_type, class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, units}
//   try {
//     // const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     const ress = await client.query(`
//           INSERT INTO course (
//             class_number,
//             department,
//             course_title,
//             subject,
//             catalog_no,
//             section,
//             component,
//             schedule,
//             learning_delivery_mode,
//             room_assigned,
//             instructor,
//             class_capacity,
//             restrictions,
//             units
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `, [req.body.class_number,
//     req.body.department,
//     req.body.course_title,
//     req.body.subject,
//     req.body.catalog_no,
//     req.body.section,
//     req.body.component,
//     req.body.schedule,
//     req.body.learning_delivery_mode,
//     req.body.room_assigned,
//     req.body.instructor,
//     req.body.class_capacity,
//     req.body.restrictions,
//     req.body.units])
//     // if single register
//     if (req.body.registration_type !== 'batch') {
//       // insert addition in course_edit
//       await database.run(db, `
//               INSERT INTO course_edit (
//                 class_number, subject, catalog_no, section, modification, last_modified
//               ) VALUES (?, ?, ?, ?, ?, ?)
//           `, [req.body.class_number, req.body.subject, req.body.catalog_no, req.body.section, 'Addition', Date.now()], false)
//       // end insert addition in course_edit
//     }
//     // end if single register
//     res.json({ message: `Insert success for course ${req.body.class_number}` }).send()
//   } catch (error) {
//     console.log('Error on api > course > create', error)
//     res.status(401).json({ message: error }).send()
//   }
// })


router.post('/api/course/create', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const courseInsertQuery = {
      text: `
        INSERT INTO "course" (
          "class_number",
          "department",
          "course_title",
          "subject",
          "catalog_no",
          "section",
          "component",
          "schedule",
          "learning_delivery_mode",
          "room_assigned",
          "instructor",
          "class_capacity",
          "restrictions",
          "units"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `,
      values: [
        req.body.class_number,
        req.body.department,
        req.body.course_title,
        req.body.subject,
        req.body.catalog_no,
        req.body.section,
        req.body.component,
        req.body.schedule,
        req.body.learning_delivery_mode,
        req.body.room_assigned,
        req.body.instructor,
        req.body.class_capacity,
        req.body.restrictions,
        req.body.units,
      ],
    };

    const courseInsertResult = await client.query(courseInsertQuery);

    // if single registration
    if (req.body.registration_type !== 'batch') {
      // Insert additional data in "course_edit"
      const courseEditInsertQuery = {
        text: `
          INSERT INTO "course_edit" (
            "class_number", "subject", "catalog_no", "section", "modification", "last_modified"
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
        values: [
          req.body.class_number,
          req.body.subject,
          req.body.catalog_no,
          req.body.section,
          'Addition',
          Date.now(),
        ],
      };

      await client.query(courseEditInsertQuery);
    }

    res.status(200).json({ message: `Insert success for course ${req.body.class_number}` });
    await client.release();
  } catch (error) {
    console.error('Error on api > course > create', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end create

// // read all by dept
// router.post('/api/course/read/all', async (req, res) => {
//   // req.body = {dept}
//   try {
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     const rows = await client.query(`
//           SELECT * FROM course WHERE department = ? ORDER BY subject, catalog_no 
//         `, [req.body.dept])
//     res.json({ rows: rows }).send()
//   } catch (error) {
//     console.log('Error on api > course > read > all', error)
//     res.status(401).json({ message: error }).send()
//   }
// })
// end read all by dept
router.post('/api/course/read/all', async (req, res) => {
  // req.body = {dept}
  let client;
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const readAllCoursesQuery = {
        text: `
          SELECT * FROM course WHERE department = $1 ORDER BY subject, catalog_no
        `,
        values: [req.body.dept],
      };

      const result = await client.query(readAllCoursesQuery);

      res.json({ rows: result.rows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > course > read > all', error);
    res.status(401).json({ message: error }).send();
  }
});


// read one
// router.post('/api/course/read/one', async (req, res) => {
//   // req.body = {class_number}
//   try {
//     const db = database.openOrCreateDB();
//     const client = await db.connect();
//     const row = await client.query(`SELECT * FROM course WHERE class_number = ?`, [req.body.class_number])
//     res.json({ row: row }).send()
//   } catch (error) {
//     console.log('Error on api > course > read > one', error)
//     res.status(401).json({ message: error }).send()
//   }
// })


router.post('/api/course/read/one', async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const courseQuery = {
      text: `
        SELECT * FROM "course" WHERE "class_number" = $1
      `,
      values: [req.body.class_number],
    };

    const row = await client.query(courseQuery);

    if (row.rows.length > 0) {
      res.status(200).json({ row: row.rows[0] });
    } else {
      res.status(200).json({ message: 'No record found' });
    }
    await client.release();
  } catch (error) {
    console.error('Error on api > course > read > one', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end read one

// update
// router.post('/api/course/update', ocsOnly, async (req, res) => {
//   // req.body: {old_class_number, new_class_number, department, course_title, subject, catalog_no, section, schedule, learning_delivery_mode, instructor, class_capacity, restrictions, units}    
//   try {
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     await client.query(`
//           UPDATE course SET class_number = ?, department = ?, course_title = ?, subject = ?, catalog_no = ?, section = ?, component = ?, schedule = ?, learning_delivery_mode = ?, room_assigned = ?, instructor = ?, class_capacity = ?, restrictions = ?, units = ? WHERE class_number = ?
//         `, [
//       req.body.class_number, req.body.department, req.body.course_title, req.body.subject, req.body.catalog_no, req.body.section, req.body.component, req.body.schedule, req.body.learning_delivery_mode, req.body.room_assigned, req.body.instructor, req.body.class_capacity, req.body.restrictions, req.body.units, req.body.class_number
//     ])
//     // update course_edit table
//     // insert row with 'updated' modification type
//     await client.query(`INSERT OR REPLACE INTO course_edit (class_number, subject, catalog_no, section, modification, last_modified) VALUES (?, ?, ?, ?, ?, ?)`, [req.body.class_number, req.body.subject, req.body.catalog_no, req.body.section, 'Updated', Date.now()])
//     // end insert row with 'updated' modification type
//     // end update course_edit table
//     res.json({ message: `Update success for ${req.body.subject} ${req.body.catalog_no} ${req.body.section}` })
//   } catch (error) {
//     console.log('Error on api > course > update', error)
//     res.status(401).json({ message: error }).send()
//   }
// })



router.post('/api/course/update', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const courseUpdateQuery = {
      text: `
        UPDATE "course"
        SET "class_number" = $1, "department" = $2, "course_title" = $3, "subject" = $4, "catalog_no" = $5, "section" = $6, "component" = $7, "schedule" = $8, "learning_delivery_mode" = $9, "room_assigned" = $10, "instructor" = $11, "class_capacity" = $12, "restrictions" = $13, "units" = $14
        WHERE "class_number" = $15
      `,
      values: [
        req.body.class_number,
        req.body.department,
        req.body.course_title,
        req.body.subject,
        req.body.catalog_no,
        req.body.section,
        req.body.component,
        req.body.schedule,
        req.body.learning_delivery_mode,
        req.body.room_assigned,
        req.body.instructor,
        req.body.class_capacity,
        req.body.restrictions,
        req.body.units,
        req.body.class_number,
      ],
    };

    await client.query(courseUpdateQuery);

    // Update the "course_edit" table
    // Insert a row with 'updated' modification type
    const courseEditUpdateQuery = {
      text: `
        INSERT INTO "course_edit" ("class_number", "subject", "catalog_no", "section", "modification", "last_modified")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("class_number")
        DO UPDATE
        SET "subject" = EXCLUDED."subject", "catalog_no" = EXCLUDED."catalog_no", "section" = EXCLUDED."section", "modification" = EXCLUDED."modification", "last_modified" = EXCLUDED."last_modified"
      `,
      values: [
        req.body.class_number,
        req.body.subject,
        req.body.catalog_no,
        req.body.section,
        'Updated',
        Date.now(),
      ],
    };

    await client.query(courseEditUpdateQuery);

    res.status(200).json({ message: `Update success for ${req.body.subject} ${req.body.catalog_no} ${req.body.section}` });
    await client.release();
  } catch (error) {
    console.error('Error on api > course > update', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end update

// delete
// router.post('/api/course/delete', ocsOnly, async (req, res) => {
//   // req.body = {class_number}
//   try {
//     const db = await database.openOrCreateDB();
//     // get original course row
//     const row = await database.get(db, `
//           SELECT subject, catalog_no, section FROM course WHERE class_number = ?
//         `, [req.body.class_number], false)
//     console.log('get original row success') // temp
//     console.log('row is', row) // temp
//     // end get original course row        
//     await database.run(db, `DELETE FROM course WHERE class_number = ?`, [req.body.class_number], false)
//     console.log('delete success') // temp
//     await database.run(db, `
//           UPDATE advising_status SET step2_status = ? WHERE student_up_mail 
//           IN (SELECT student_up_mail FROM ecf WHERE class_number = ?)
//           `, ['waiting for approval', req.body.class_number], false)
//     await database.run(db, `DELETE FROM ecf WHERE class_number = ?`, [req.body.class_number], false)
//     // insert into course_edit
//     await database.run(db, `
//           INSERT OR REPLACE INTO course_edit (
//             class_number, subject, catalog_no, section, modification, last_modified
//           ) VALUES (?, ?, ?, ?, ?, ?)
//         `, [req.body.class_number, row.subject, row.catalog_no, row.section, 'Dissolved', Date.now()], false)
//     console.log('insert into course_edit success') // temp
//     // end insert into course_edit
//     res.json({ message: `Delete success for class_number ${req.body.class_number}` }).send()
//   } catch (error) {
//     console.log('Error on api > course > delete', error)
//     res.status(401).json({ message: error }).send()
//   }
// })

router.post('/api/course/delete', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    // Get the original course row
    const getOriginalRowQuery = {
      text: `
        SELECT "subject", "catalog_no", "section" FROM "course" WHERE "class_number" = $1
      `,
      values: [req.body.class_number],
    };

    const originalRow = await client.query(getOriginalRowQuery);

    // Delete the course
    const deleteCourseQuery = {
      text: `
        DELETE FROM "course" WHERE "class_number" = $1
      `,
      values: [req.body.class_number],
    };

    await client.query(deleteCourseQuery);

    // Update advising_status
    const updateAdvisingStatusQuery = {
      text: `
        UPDATE "advising_status"
        SET "step2_status" = $1
        WHERE "student_up_mail" IN (
          SELECT "student_up_mail" FROM "ecf" WHERE "class_number" = $2
        )
      `,
      values: ['waiting for approval', req.body.class_number],
    };

    await client.query(updateAdvisingStatusQuery);

    // Delete from ecf
    const deleteEcfQuery = {
      text: `
        DELETE FROM "ecf" WHERE "class_number" = $1
      `,
      values: [req.body.class_number],
    };

    await client.query(deleteEcfQuery);

    // Insert into course_edit
    const insertIntoCourseEditQuery = {
      text: `
        INSERT INTO "course_edit" (
          "class_number", "subject", "catalog_no", "section", "modification", "last_modified"
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("class_number")
        DO UPDATE
        SET "subject" = EXCLUDED."subject",
            "catalog_no" = EXCLUDED."catalog_no",
            "section" = EXCLUDED."section",
            "modification" = EXCLUDED."modification",
            "last_modified" = EXCLUDED."last_modified"
      `,
      values: [req.body.class_number, originalRow.rows[0].subject, originalRow.rows[0].catalog_no, originalRow.rows[0].section, 'Dissolved', Date.now()],
    };

    await client.query(insertIntoCourseEditQuery);

    res.status(200).json({ message: `Delete success for class_number ${req.body.class_number}` });
    await client.release();
  } catch (error) {
    console.error('Error on api > course > delete', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end delete

// delete all
router.post('/api/course/delete/all', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query(`DELETE FROM course`);
    res.json({ message: 'Deleted all rows from course successfully' }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > course > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end delete all

// end course APIs

// course_edit APIs

// read all
router.post('/api/course_edit/read/all', async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const rows = await client.query(`
      SELECT * FROM course_edit ORDER BY last_modified DESC
    `);
    res.json({ rows: rows.rows }).send(); // Use rows.rows to access the query results
    await client.release();
  } catch (error) {
    console.log('Error on api > course_edit > read > all', error);
    res.status(401).json({ message: error }).send();
  }

});

// end read all

// delete all
router.post('/api/course_edit/delete/all', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query(db, `DELETE FROM course_edit`);
    res.json({ message: 'Deleted all rows from course_edit successfully' }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > course_edit > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end delete all

// end course_edit APIS

// end Routes

// Middlewares
function ocsOnly(req, res, next) {
  try {
    if (req.user.role === 'ocs') {
      next()
    } else {
      throw 'User not OCS'
    }
  } catch (error) {
    console.log('Error on course.js > ocsOnly')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
}
// end Middlewares

module.exports = { router }