const database = require('../database/database');
const express = require('express');
const router = express.Router();

// Routes

// create grade
router.post('/api/grade/create', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const gradeInsertQuery = {
      text: `
        INSERT INTO "grade" (
          "year_level",
          "semester",
          "units",
          "subject",
          "grade",
          "student_up_mail"
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `,
      values: [
        req.body.year_level,
        req.body.semester,
        req.body.units,
        req.body.subject,
        req.body.grade,
        req.body.student_up_mail,
      ],
    };

    await client.query(gradeInsertQuery);

    res.status(200).json({ message: `Insert success for student ${req.body.student_up_mail} in ${req.body.subject}` });
    await client.release();
  } catch (error) {
    console.error('Error on api > grade > create', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// end create grade


// Read All grades from Student Using OCS Account
router.post('/api/grade/read/all/student/ocsAcc', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
    const gradeRowsQuery = {
      text: `
        SELECT * FROM "grade" WHERE "student_up_mail" = $1
      `,
      values: [req.body.student_up_mail],
    };

    const gradeRows = await client.query(gradeRowsQuery);

    const gradeCompleteRows = [];
    for (let i = 0; i < gradeRows.rows.length; i++) {
      console.log('gradeRows.rows[i].subject', gradeRows.rows[i].subject);
      const gradeRowQuery = {
        text: `
          SELECT * FROM grade WHERE subject = $1
        `,
        values: [gradeRows.rows[i].subject],
      };
      const gradeRow = await client.query(gradeRowQuery);
      console.log('gradeRow.rows[0]', gradeRow.rows[0]);
      gradeCompleteRows.push(gradeRow.rows[0]);
    }
    console.log('gradeCompleteRows', gradeCompleteRows);
    res.json({ rows: gradeCompleteRows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > grade > read > all > student > ocsAcc', error);
    res.status(401).json({ message: error }).send();
  }
});
// end Read All grades from Student Using OCS Account


// Read All from Student Using Adviser Account
router.post('/api/grade/read/all/student/adviserAcc', adviserOnly, async (req, res) => { //**** */
  let client;
  // required body: {student_up_mail}
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const gradeRowsQuery = {
        text: `
          SELECT * FROM grade WHERE student_up_mail = $1
        `,
        values: [req.body.student_up_mail],
      };
      const gradeRows = await client.query(gradeRowsQuery);
      console.log('gradeRows', gradeRows);

      const gradeCompleteRows = [];
      for (let i = 0; i < gradeRows.rows.length; i++) {
        console.log('gradeRows.rows[i].subject', gradeRows.rows[i].subject);
        const gradeRowQuery = {
          text: `
            SELECT * FROM grade WHERE subject = $1
          `,
          values: [gradeRows.rows[i].subject],
        };
        const gradeRow = await client.query(gradeRowQuery);
        console.log('gradeRow.rows[0]', gradeRow.rows[0]);
        gradeCompleteRows.push(gradeRow.rows[0]);
      }
      console.log('gradeCompleteRows', gradeCompleteRows);
      res.json({ rows: gradeCompleteRows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > grade > read > all > student > adviserAcc', error);
    res.status(401).json({ message: error }).send();
  }
});
// end Read All from Student Using Adviser Account


// read all by semester
router.post('/api/grade/read/all', async (req, res) => {
  // req.body = {dept}
  let client;
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    try {
      const readAllGradeQuery = {
        text: `
          SELECT * FROM grade WHERE semester = $1
        `,
        values: [req.body.semester],
      };

      const result = await client.query(readAllGradeQuery);

      res.json({ rows: result.rows }).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.log('Error on api > grade > read > all', error);
    res.status(401).json({ message: error }).send();
  }
});
// end read all by semester



// Middleware
function ocsOnly(req, res, next) {
  try {
    if (req.user.role === 'ocs') {
      next();
    } else {
      throw 'User not OCS';
    }
  } catch (error) {
    console.log('Error on grades.js > ocsOnly');
    console.log(error);
    res.status(401).json({ message: error }).send();
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

module.exports = { router };
