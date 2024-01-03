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
          "student_id",
          "subject",
          "semester",
          "year_level",
          "grade"
        ) VALUES ($1, $2, $3, $4, $5)
      `,
      values: [
        req.body.student_id,
        req.body.subject,
        req.body.semester,
        req.body.year_level,
        req.body.grade,
      ],
    };

    await client.query(gradeInsertQuery);

    res.status(200).json({ message: `Insert success for student ${req.body.student_id} in ${req.body.subject}` });
  } catch (error) {
    console.error('Error on api > grade > create:', error);

    // Check if it's a PostgreSQL constraint violation (e.g., unique key violation)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Duplicate entry. This record already exists.' });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.release();
    }
  }
});

// read all grades
router.post('/api/grade/read/all', async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const readAllGradesQuery = {
      text: `
        SELECT * FROM "grade" WHERE "student_id" = $1
      `,
      values: [req.body.student_id],
    };

    const result = await client.query(readAllGradesQuery);

    res.json({ rows: result.rows }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api > grade > read > all', error);
    res.status(401).json({ message: error }).send();
  }
});

// delete grade
router.post('/api/grade/delete', ocsOnly, async (req, res) => {
  try {
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    const deleteGradeQuery = {
      text: `
        DELETE FROM "grade" WHERE "student_id" = $1 AND "subject" = $2
      `,
      values: [req.body.student_id, req.body.subject],
    };

    await client.query(deleteGradeQuery);

    res.status(200).json({ message: `Delete success for student ${req.body.student_id} in ${req.body.subject}` });
    await client.release();
  } catch (error) {
    console.error('Error on api > grade > delete', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

module.exports = { router };
