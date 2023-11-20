const database = require('../database/database')
const express = require('express')
const router = express.Router()


// Revert Advising Status to Not Started for All Students
router.post('/api/advising/revertAllStatus', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    // Update advising status to 'Not Started' for all students with status 'Waiting for Approval' or 'Done'
    const updateAllStatusQuery = {
      text: `
        UPDATE advising_status
        SET step1_status = 'not started', step2_status = 'not started', step3_status = 'not started'
        WHERE step1_status IN ('waiting for approval', 'done')
      `,
    };

    await client.query(updateAllStatusQuery);

    // Delete rows from the 'ecf' table for all students with status 'Not Started'
    const deleteECFQuery = {
      text: `
        DELETE FROM ecf
        WHERE student_up_mail IN (
          SELECT student_up_mail FROM advising_status WHERE step1_status = 'not started'
        )
      `,
    };

    await client.query(deleteECFQuery);

    // Delete rows from the 'curri_progress' table for all students with status 'Not Started'
    const deleteCurriProgressQuery = {
      text: `
        DELETE FROM curri_progress
        WHERE student_up_mail IN (
          SELECT student_up_mail FROM advising_status WHERE step1_status = 'not started'
        )
      `,
    };

    await client.query(deleteCurriProgressQuery);

    res.json({ message: 'Advising status reverted, and related data deleted for all applicable students' });
    await client.release();
  } catch (error) {
    console.error('Error on /api/advising/revertAllStatus:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message || error });
  }
});

// Get Status
// Required Request Body: student_up_mail
router.post('/api/advising/getStatus', loggedIn, async (req, res) => {
  try {
    if (!req.body.student_up_mail) {
      throw 'Invalid request body'
    } else {
      // const source = './database/db.sqlite'
      const db = await database.openOrCreateDB();
      const client = await db.connect();
      console.log('req.body.student_up_mail', req.body.student_up_mail);

      const result_query = {
        text: `
          SELECT step1_status, step2_status, step3_status, remarks FROM advising_status WHERE student_up_mail = $1
        `,
        values: [req.body.student_up_mail],
      };
      // console.log('result_query', result_query);

      const result = await client.query(result_query);
      // console.log('result.rows[0]', result);
      if (result) {
        res.json({ step1_status: result.rows[0].step1_status, step2_status: result.rows[0].step2_status, step3_status: result.rows[0].step3_status, remarks: result.rows[0].remarks }).send()
      }
      else {
        res.json({ step1_status: 'not found', step2_status: 'not found', step3_status: 'not found', remarks: 'not found' }).send()
      }
      await client.release();
    }
  } catch (error) {
    console.log('Error in api advising getStatus')
    console.log(error)
    res.json({ messsage: error }).send()
  }
})
// end Get Status

// Read All Advising Status All Departments
router.post('/api/advising/read/all/all', ocsOnly, async (req, res) => {
  try {
    // req.body = {offset, limit, column, order, searchString, filterByDepartmentText, filterByDegreeProgramText, filterByStep1StatusText, filterByStep2StatusText, filterByStep3StatusText }
    var myOffset = 0
    if (req.body.offset) {
      myOffset = req.body.offset
    }
    var myLimit = 50
    if (req.body.limit) {
      myLimit = req.body.limit
    }
    var sortColumn = 'department'
    if (req.body.column) {
      sortColumn = req.body.column
    }
    var sortOrder = 'ASC'
    if (req.body.order) {
      sortOrder = req.body.order
    }
    var searchString = ''
    if (req.body.searchString) {
      searchString = req.body.searchString
    }

    var filterByDepartmentText = ''
    if (req.body.filterByDepartmentText) {
      filterByDepartmentText = ` AND (department = '${req.body.filterByDepartmentText}')`
    }

    var filterByDegreeProgramText = ''
    if (req.body.filterByDegreeProgramText) {
      filterByDegreeProgramText = ` AND (degree_program) = '${req.body.filterByDegreeProgramText}')`
    }

    var filterByStep1StatusText = ''
    if (req.body.filterByStep1StatusText) {
      filterByStep1StatusText = ` AND (step1_status = '${req.body.filterByStep1StatusText}')`
    }

    var filterByStep2StatusText = ''
    if (req.body.filterByStep2StatusText) {
      filterByStep2StatusText = ` AND (step2_status = '${req.body.filterByStep2StatusText}')`
    }

    var filterByStep3StatusText = ''
    if (req.body.filterByStep3StatusText) {
      filterByStep3StatusText = ` AND (step3_status = '${req.body.filterByStep3StatusText}')`
    }

    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const rows = await client.query(`
      SELECT *
      FROM advising_status 
      WHERE
        (
          student_up_mail LIKE '%${searchString}%'
          OR adviser_up_mail LIKE '%${searchString}%'
          OR degree_program LIKE '%${searchString}%'
          OR department LIKE '%${searchString}%'
          OR step1_status LIKE '%${searchString}%'
          OR step2_status LIKE '%${searchString}%'
          OR step3_status LIKE '%${searchString}%'
        )
        ${filterByDepartmentText}
        ${filterByDegreeProgramText}
        ${filterByStep1StatusText}
        ${filterByStep2StatusText}
        ${filterByStep3StatusText}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${myLimit}
      OFFSET ${myOffset}`);
    res.send(rows.rows);
    await client.release();
  } catch (error) {
    console.log('error on /api/advising/read/all/all') // temp
    console.log(error)
    res.send('Error')
  }
})
// end Read All Advising Status All Departments

// Read All Advising Status by Adviser
router.post('/api/advising/read/all/adviser', adviserOnly, async (req, res) => {
  try {
    // req.body = {adviser_up_mail, offset, limit, column, order, searchString, filterByRole}
    var myOffset = 0
    if (req.body.offset) {
      myOffset = req.body.offset
    }
    var myLimit = 50
    if (req.body.limit) {
      myLimit = req.body.limit
    }
    var sortColumn = 'degree_program'
    if (req.body.column) {
      sortColumn = req.body.column
    }
    var sortOrder = 'ASC'
    if (req.body.order) {
      sortOrder = req.body.order
    }
    var searchString = ''
    if (req.body.searchString) {
      searchString = req.body.searchString
    }
    var filterByDegreeProgramText = ''
    if (req.body.filterByDegreeProgramText) {
      filterByDegreeProgramText = ` AND (degree_program) = '${req.body.filterByDegreeProgramText}')`
    }

    var filterByStep1StatusText = ''
    if (req.body.filterByStep1StatusText) {
      filterByStep1StatusText = ` AND (step1_status = '${req.body.filterByStep1StatusText}')`
    }

    var filterByStep2StatusText = ''
    if (req.body.filterByStep2StatusText) {
      filterByStep2StatusText = ` AND (step2_status = '${req.body.filterByStep2StatusText}')`
    }

    var filterByStep3StatusText = ''
    if (req.body.filterByStep3StatusText) {
      filterByStep3StatusText = ` AND (step3_status = '${req.body.filterByStep3StatusText}')`
    }

    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const rows = await client.query(`
      SELECT student_up_mail, degree_program, step1_status, step2_status, step3_status 
      FROM advising_status 
      WHERE
        (student_up_mail LIKE '%${searchString}%'
        OR degree_program LIKE '%${searchString}%'
        OR step1_status LIKE '%${searchString}%'
        OR step2_status LIKE '%${searchString}%'
        OR step3_status LIKE '%${searchString}%')
        ${filterByDegreeProgramText}
        ${filterByStep1StatusText}
        ${filterByStep2StatusText}
        ${filterByStep3StatusText}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${myLimit}
      OFFSET ${myOffset}`)
    res.send(rows.rows);
    await client.release();
  } catch (error) {
    console.log('error on /api/advising/read/all/adviser') // temp
    console.log(error)
    res.send('Error')
  }
})
// end Read All Advising Status by Adviser

// Update Status
router.post('/api/advising_status/update', adviserOnly, async (req, res) => {
  // req.body = {student_up_mail, status}
  try {
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    var remarksText = ''
    if (req.body.status == "Waiting for Revision") {
      remarksText = `, remarks = '${req.body.remarks}'`
    }
    // await database.run(db, `
    //   UPDATE advising_status SET step2_status = ?
    //   ${remarksText} 
    //   WHERE student_up_mail = ?
    // `, [req.body.status, req.body.student_up_mail], false)
    const updateQuery = {
      text: `
        UPDATE advising_status 
        SET step2_status = $1
        ${remarksText ? `, remarks = $2` : ''} 
        WHERE student_up_mail = $${remarksText ? 3 : 2}
      `,
      values: [req.body.status, ...(remarksText ? [req.body.remarks, req.body.student_up_mail] : [req.body.student_up_mail])],
    };

    await client.query(updateQuery);

    res.json({ message: `Updated status for ${req.body.student_up_mail} to ${req.body.status} successfully` }).send()
    await client.release();
  } catch (error) {
    console.log('Error on api > advising_status > update', error)
    res.json({ message: error }).send()
  }
})
// end Update Status

// Delete All Status
router.post('/api/advising_status/delete/all', ocsOnly, async (req, res) => {
  try {
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query(`DELETE FROM advising_status`);
    res.json({ message: 'Deleted all rows from advising_status successfully' }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > advising_status > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Delete All Status

router.post('/api/advising/curri/update', studentOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    // Query to retrieve curriculum progress for the student
    const curriProgressQuery = {
      text: 'SELECT * FROM "curri_progress" WHERE "student_up_mail" = $1',
      values: [req.user.up_mail],
    };

    const curriProgressResult = await client.query(curriProgressQuery);

    if (curriProgressResult.rows.length > 0) {
      // Update curriculum progress
      const updateCurriProgressQuery = {
        text: `
          UPDATE "curri_progress"
          SET "curri_progress" = $1, "modified" = $2
          WHERE "student_up_mail" = $3
        `,
        values: [JSON.stringify(req.body.curri_progress), Date.now(), req.user.up_mail],
      };

      await client.query(updateCurriProgressQuery);

      // Update advising status
      const updateAdvisingStatusQuery = {
        text: `
          UPDATE "advising_status"
          SET "step1_status" = $1
          WHERE "student_up_mail" = $2
        `,
        values: ['done', req.user.up_mail],
      };

      await client.query(updateAdvisingStatusQuery);

      res.json({ message: 'Updated' });
      await client.release();

    } else {
      // Insert curriculum progress
      const insertCurriProgressQuery = {
        text: `
          INSERT INTO "curri_progress" ("student_up_mail", "curri_progress", "created", "modified")
          VALUES ($1, $2, $3, $4)
        `,
        values: [req.user.up_mail, JSON.stringify(req.body.curri_progress), Date.now(), Date.now()],
      };

      await client.query(insertCurriProgressQuery);

      // Update advising status
      const updateAdvisingStatusQuery = {
        text: `
          UPDATE "advising_status"
          SET "step1_status" = $1
          WHERE "student_up_mail" = $2
        `,
        values: ['done', req.user.up_mail],
      };

      await client.query(updateAdvisingStatusQuery);

      res.json({ message: 'Created' });
      await client.release();
    }
  } catch (error) {
    console.error('Error on advising.js > api > advising > curri > update', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end Create/Update Curri Progress

// Read Curri Progress
router.post('/api/advising/curri/read', studentOnly, async (req, res) => {
  try {
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    // const row = await database.get(db, `SELECT * FROM curri_progress WHERE student_up_mail = ?`, [req.user.up_mail], false)
    const result = await client.query('SELECT * FROM curri_progress WHERE student_up_mail = $1', [req.user.up_mail]);

    if (result.rows.length > 0) {
      res.status(200).json({ row: result.rows[0] }).send();
    } else {
      res.status(200).json({ message: 'No record found' }).send();
    }
    await client.release();
  } catch (error) {
    console.log('Error on advising.js > api > advising > curri > read')
    console.log(error)
    res.status(401).json({ message: error }).send()
  }
})
// end Read Curri Progress

router.post('/api/advising/curri/read/adviser', adviserOnly, async (req, res) => {
  try {
    // Check if 'student_up_mail' property exists in the request body
    if (!req.body.student_up_mail) {
      throw 'Invalid request body';
    }
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const result = await client.query('SELECT * FROM curri_progress WHERE student_up_mail = $1', [req.body.student_up_mail]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.status(200).json({ row }).send();
    } else {
      res.status(200).json({ message: 'No record found' }).send();
    }
    await client.release();
  } catch (error) {
    console.error('Error on advising.js > api > advising > curri > read > adviser');
    console.error(error);
    res.status(401).json({ message: error }).send();
  }
});
// end Read Curri Progress Using Adviser Account

// Read All Curri Progress
router.post('/api/advising/curri/read/all', adviserOnly, async (req, res) => {
  try {
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const rows = await client.query(`
      SELECT * FROM curri_progress
    `);
    res.json({ rows: rows }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > advising > curri > read > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Read All Curri Progress

// Delete All Status
router.post('/api/advising/curri/delete/all', ocsOnly, async (req, res) => {
  try {
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query(`DELETE FROM curri_progress`);
    res.json({ message: 'Deleted all rows from curri_progress successfully' }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > advising > curri > delete > all', error)
    res.status(401).json({ message: error }).send()
  }
})
// end Delete All Status

// Middlewares
function adminOnly(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      throw 'User not Admin'
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on admin.js > adminOnly', error)
    res.status(401).json({ message: error }).send()
  }
}
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
    console.log('Error on advising.js > ocsOnly', error)
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
// end Middlewares

module.exports = { router }