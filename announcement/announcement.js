const express = require('express')
const database = require('../database/database')
const { v4: uuidv4 } = require('uuid');

// Routes
const router = express.Router()

// Create Announcement
router.post('/api/announcement/create', OCSandAdminOnly, async (req, res) => {
  try {
    // check body
    if (!req.body.title || !req.body.body) {
      throw 'Invalid body'
    }
    // const source = './database/db.sqlite'
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    // await client.query(`
    //     INSERT INTO announcement (id, title, body, created, modified) VALUES (?, ?, ?, ?, ?)
    //   `, [uuidv4(), req.body.title, req.body.body, Date.now(), Date.now()])
    await client.query(
      `
        INSERT INTO announcement (id, title, body, created, modified)
        VALUES ($1, $2, $3, to_timestamp($4 / 1000.0), to_timestamp($5 / 1000.0))
      `,
      [uuidv4(), req.body.title, req.body.body, Date.now(), Date.now()]
    );


    res.json({ message: `Announcement added: ${req.body.title}` }).send();
    await client.release();
  } catch (error) {
    console.log('Error on api announcement create')
    console.log(error)
    res.json({ message: error }).send()
  }
})
// end Create Announcement

// Get Announcements
// router.post('/api/announcement/all', async (req, res) => {
//   try {
//     // check body
//     if (!req.body.limit) {
//       throw 'Invalid request body'
//     }
//     var myOffset = 0
//     if (req.body.offset) {
//       myOffset = req.body.offset
//     }
//     const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB(source)
//     const rows = await database.all(db, `SELECT * FROM announcement ORDER BY modified DESC LIMIT ${req.body.limit} OFFSET ${myOffset}`, [], false)
//     res.json({ rows: rows }).send()
//   } catch (error) {
//     console.log('Error on api announcement all')
//     console.log(error)
//     res.json({ message: error }).send()
//   }
// })

router.post('/api/announcement/all', async (req, res) => {
  try {
    // Check if 'limit' property exists in the request body
    if (!req.body.limit) {
      throw 'Invalid request body';
    }

    // Set the offset to 0 if not provided
    const offset = req.body.offset || 0;

    const limit = req.body.limit;
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const result = await client.query(
      'SELECT * FROM announcement ORDER BY modified DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({ rows: result.rows }).send();
    await client.release();
  } catch (error) {
    console.error('Error on api announcement all');
    console.error(error);
    res.status(500).json({ message: error }).send();
  }
});
// end Get Announcements

// Get Next Announcements
// router.post('/api/announcement/next', async (req, res) => {
//   try {
//     console.log('req.body', req.body);
//     // check body
//     if (req.body.loaded == undefined) {
//       throw 'Invalid request body'
//     }
//     // count announcements
//     // const source = './database/db.sqlite'
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();
//     const result = await client.query(`SELECT COUNT(*) as count FROM announcement`);
//     // const result = await database.get(db, `SELECT COUNT(*) as count FROM announcement`, [], false)
//     // console.log('result', result);
//     const difference = result.count - (req.body.loaded)
//     if (difference <= 0) {
//       res.json({ more: 'false' }).send()
//     } else if (difference > 0 && difference <= 5) {
//       const result = await client.query(`SELECT * FROM announcement ORDER BY modified DESC LIMIT 5 OFFSET ${req.body.loaded}`)
//       res.json({ announcements: result, more: 'false' }).send()
//     } else {
//       const result = await client.query(`SELECT * FROM announcement ORDER BY modified DESC LIMIT 5 OFFSET ${req.body.loaded}`)
//       res.json({ announcements: result, more: 'true' }).send()
//     }
//   } catch (error) {
//     console.log('Error on api announcement next')
//     console.log(error)
//     res.status(401).json({ message: error }).send()
//   }
// })








router.post('/api/announcement/next', async (req, res) => {
  try {
    // console.log('req.body', req.body);

    // Check if 'loaded' property exists in the request body
    if (req.body.loaded === undefined) {
      throw 'Invalid request body';
    }

    // Count announcements
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    const resultCount = await client.query('SELECT COUNT(*) as count FROM announcement');
    const totalAnnouncements = parseInt(resultCount.rows[0].count);

    // Calculate the difference
    const difference = totalAnnouncements - req.body.loaded;

    if (difference <= 0) {
      res.json({ more: false }).send(); // No more announcements to load
    } else {
      const limit = Math.min(difference, 5); // Limit the number of announcements to load
      const offset = req.body.loaded;

      const result = await client.query(
        'SELECT * FROM announcement ORDER BY modified DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      const more = difference > 5; // Determine if there are more announcements

      res.json({ announcements: result.rows, more }).send();
    };
    await client.release();

  } catch (error) {
    console.log('Error on api announcement next');
    console.error(error);
    res.status(500).json({ message: error }).send();
  }
});
// end Get Next Announcements  

// Update Announcement
router.post('/api/announcement/edit', OCSandAdminOnly, async (req, res) => {
  try {
    // check body
    if (!req.body.old_body || !req.body.new_title || !req.body.new_body) {
      throw 'Invalid request body'
    } else {
      const db = await database.openOrCreateDB();
      const client = await db.connect();
      // get original row
      // const row = await database.get(db, `SELECT * FROM announcement WHERE body = ?`, [req.body.old_body], false)
      const row = await client.query(`SELECT * FROM announcement WHERE body = $1`, [req.body.old_body]);

      // await database.run(db, `
      //     UPDATE announcement SET title = ?, body = ?, modified = ? WHERE body = ?
      //   `, [req.body.new_title, req.body.new_body, Date.now(), row.body], false)
      await client.query(`
  UPDATE announcement
  SET title = $1, body = $2, modified = $3
  WHERE body = $4
  `, [req.body.new_title, req.body.new_body, Date.now(), row.body]);

      res.json({ message: `Edit success for announcement ${row.title}` }).send()
    };
    await client.release();
  } catch (error) {
    console.log('Error on api announcement edit')
    console.log(error)
    res.json({ message: error }).send()
  }
})
// end Update Announcement

// Delete Announcement
// router.post('/api/announcement/delete', OCSandAdminOnly, async (req, res) => {
//   try {
//     // check body
//     if (!req.body.body) {
//       throw 'Invalid request body'
//     } else {
//       const source = './database/db.sqlite'
//       const db = await database.openOrCreateDB(source)
//       await database.run(db, `DELETE FROM announcement WHERE body = ?`, [req.body.body], false)
//       res.json({ message: `Delete success for body: ${req.body.body}` }).send()
//     }
//   } catch (error) {
//     console.log('Error on api announcement delete')
//     console.log(error)
//     res.json({ message: error }).json()
//   }
// })


router.post('/api/announcement/delete', OCSandAdminOnly, async (req, res) => {
  try {
    // Check if 'body' property exists in the request body
    if (!req.body.body) {
      throw 'Invalid request body';
    }
    const db = await database.openOrCreateDB();
    const client = await db.connect();
    await client.query('DELETE FROM announcement WHERE body = $1', [req.body.body]);

    res.json({ message: `Delete success for body: ${req.body.body}` }).send();
    await client.release();
  } catch (error) {
    console.error('Error on api announcement delete');
    console.error(error);
    res.status(500).json({ message: error }).send();
  }
});
// end Delete Announcement

// end Routes

// Middlewares
function OCSandAdminOnly(req, res, next) {
  try {
    if (!req.user) {
      throw 'User not logged in'
    }
    if (req.user.role === 'ocs' || req.user.role === 'admin') {
      next()
    } else {
      throw 'User not ocs nor admin'
    }
  } catch (error) {
    console.log('Error on announcements.js > OCSandAdminOnly') // temp
    console.log(error)
    res.send({ message: error })
  }
}
// end Middlewares

module.exports = { router }