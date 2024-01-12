const database = require("../database/database");
const express = require("express");
const router = express.Router();

// Middleware
const loggedIn = async (req, res, next) => {
    try {
        if (!req.user) {
            throw "User not logged in";
        }
        next();
    } catch (error) {
        res.status(401).send();
    }
};

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

router.post("/api/curriculum/progress", loggedIn, async (req, res) => {
    try {
        // req.body = {
        //     studentEmail: "", // if OCS
        //     degreeProgram: "", // req.user.degree_program if student, passed if OCS
        // }
        let studentEmail;
        let degreeProgram;
        if (req.user?.role == "ocs" || true) {
            studentEmail = req.body.studentEmail;
            degreeProgram = req.body.degreeProgram.toLowerCase();
        }
        if (req.user?.role == "student") {
            studentEmail = req.user?.email;
            degreeProgram = req.user?.degreeProgram.toLowerCase();
        }
        const db = await database.openOrCreateDB();
        const client = await db.connect();

        const totalUnitsResult = await client.query(`
            SELECT total_units
            FROM degree_programs
            WHERE name = '${degreeProgram}';
        `);
        const totalUnits = totalUnitsResult.rows[0].total_units;

        const progressResult = await client.query(`
            SELECT SUM(units)
            FROM grade
            WHERE student_up_mail = '${studentEmail}'
            AND grade NOT IN ('INC', 'DRP', '4.00', '5.00');
        `);
        const progress = parseInt(progressResult.rows[0].sum);

        res.json({
            totalUnits: totalUnits,
            progress: progress
        }).send();

        client.release();
    } catch (error) {
        console.log("Error on api/curriculum/progress", error);
        res.status(400).send();
    }
});

module.exports = { router };