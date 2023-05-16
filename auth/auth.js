/*
@dependencies
    connect-sqlite3
    express
    express-session
    passport
    passport-google-oidc
    uuid
*/

const express = require('express')
const GoogleStrategy = require('passport-google-oidc')
const passport = require('passport')
const router = express.Router();
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const { v4: uuidv4 } = require('uuid')

let database // database.js file containing sql queries helper functions
let authDb // auth.sqlite

async function main(app, _database, _authDb, authFolderPath) {
    return new Promise(async (resolve, reject) => {
        try {
            database = _database
            authDb = _authDb
            app.use(session({
                secret: 'zrfvnzr',
                resave: false,
                saveUninitialized: false,
                store: new SQLiteStore({ db: 'session.db', dir: authFolderPath })
            }))
            app.use(passport.initialize())
            app.use(passport.session())
            await configureGoogleStrategy()
            await configureRoutes(app)
            resolve()
        } catch (error) {
            console.log('Error on auth.js > main') // temp
            console.log(error) // temp
            reject()
        }
    })
}

async function configureGoogleStrategy() {
    return new Promise(async (resolve, reject) => {
        try {
            // Configure GoogleStrategy
            passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/oauth2/redirect/google',
                scope: ['https://www.googleapis.com/auth/userinfo.email', 'profile'],
            }, async function verify(issuer, profile, cb) {
                const row = await database.get(authDb, `SELECT * FROM users WHERE up_mail = ?`, [
                    profile.emails[0].value
                ], false)
                if (row) {
                    return cb(null, row)
                } else {
                    return cb(null, false)
                }
            }))

            // serialize() and deserialize()
            passport.serializeUser(function (user, cb) {
                process.nextTick(function () {
                    cb(null, user)
                })
            })

            passport.deserializeUser(function (user, cb) {
                process.nextTick(function () {
                    const userWithoutId = {
                        role: user.role,
                        up_mail: user.up_mail,
                        first_name: user.first_name,
                        middle_name: user.middle_name,
                        last_name: user.last_name
                    }
                    return cb(null, userWithoutId);
                })
            })

            resolve()
        } catch (error) {
            console.log('Error on auth.js > configureGoogleStrategy')
            console.log(error)
            reject()
        }
    })
}

async function configureRoutes(app) {

    // authorize
    router.post('/api/auth/authorize', (req, res) => {
        if (req.user) {
            res.send(req.user)
        } else {
            res.status(401).send()
        }
    })
    // end authorize

    // index
    router.post('/api/auth/index', adminOnly, async (req, res) => {
        try {
            // req.body.column req.body.order e.g. 'up_mail ASC', 'first_name DESC'
            var myOffset = 0
            if (req.body.offset) {myOffset = req.body.offset}
            var myLimit = 50
            if (req.body.limit) {myLimit = req.body.limit}
            var sortColumn = 'role'
            if (req.body.column) {sortColumn = req.body.column}
            var sortOrder = 'ASC'
            if (req.body.order) {sortOrder = req.body.order}
            var searchString = ''
            if (req.body.searchString) {searchString = req.body.searchString}
            var filterByRoleText = ''
            if (req.body.filterByRole) {filterByRoleText = `AND (role = '${req.body.filterByRole}')`}
            const rows = await database.all(authDb, `
                SELECT * FROM users WHERE
                    (up_mail LIKE '%${searchString}%'
                    OR first_name LIKE '%${searchString}%'
                    OR middle_name LIKE '%${searchString}%'
                    OR last_name LIKE '%${searchString}%')
                    ${filterByRoleText}
                    ORDER BY ${sortColumn} ${sortOrder}
                    LIMIT ${myLimit}
                    OFFSET ${myOffset}
            `, [], false)
            res.status(200).json({rows: rows}).send()
        } catch (error) {
            res.status(400).json({message: error}).send()
        }
    })
    // end index

    // count
    router.post('/api/auth/users/count', adminOnly, async (req, res) => {
        try {
            var filterByRoleText = ''
            if (req.body.filterByRole) {
                filterByRoleText = `WHERE role = '${req.body.filterByRole}'`
            }
            const rows = await database.get(authDb, `
                SELECT COUNT(*) AS count FROM users ${filterByRoleText}
            `, [], false)
            res.json({ count: rows.count }).send()
        } catch (error) {
            console.log('error on /api/countUsers')
            console.log(error)
            res.status(401).json({ message: error }).send()
        }
    })
    // end count

    // login
    router.get('/api/auth/login/federated/google', passport.authenticate('google'))
    router.get('/oauth2/redirect/google', passport.authenticate('google', {
        failureRedirect: '/login?error=1'
    }), (req, res) => {
        try {
            if (req.cookies.remember === 'true') {
                req.session.cookie.maxAge = 86400000 // 7 days
            }
        } catch (error) {
            // console.log(error)
        }
        // if you want to redirect different roles to different urls, do it here
        res.redirect('/')
    })
    // end login

    // logout
    router.post('/api/auth/logout', (req, res) => {
        req.logout(function (err) {
            if (err) { res.json({ message: `Error on logout: ${err}`, redirect: '/' }).send() }
            res.json({ message: 'Logout success.', redirect: '/login?loggedOut=true' })
        })
    })
    // end logout

    // register
    router.post('/api/register', adminOnly, async (req, res) => {
        try {
            // body checker
            if (
                !req.body.role ||
                !req.body.up_mail ||
                !req.body.first_name ||
                !req.body.middle_name ||
                !req.body.last_name
                ) {
                    // invalid body
                    throw 'Invalid request body'
            } else {
                const row = await database.get(authDb, `
                    SELECT * FROM user WHERE up_mail = ?
                `, [req.body.up_mail], false)
                if (row) {
                    // user with up_mail already exists
                    throw 'User with up_mail already exists'
                } else {
                    // insert the new user
                    await database.run(authDb, `
                        INSERT OR REPLACE INTO user (
                            id,
                            role,
                            up_mail,
                            first_name,
                            middle_name,
                            last_name
                            ) VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        uuidv4(),
                        req.body.role.toLowerCase(),
                        req.body.up_mail.toLowerCase(),
                        req.body.first_name.toLowerCase(),
                        req.body.middle_name.toLowerCase(),
                        req.body.last_name.toLowerCase()
                    ], false)
                    // Create row in advising_status table if student
                    if (req.body.role == 'student') {
                        await database.run(db, `
                            INSERT OR REPLACE INTO advising_status (student_up_mail, adviser_up_mail, degree_program, department, step1_status, step2_status, step3_status) VALUES (
                            ?, ?, ?, ?, ?, ?, ?
                        )`, [req.body.up_mail.toLowerCase(), req.body.adviser_up_mail.toLowerCase(), req.body.degree_program.toLowerCase(), req.body.department.toLowerCase(), 'not started', 'not started', 'no access'], false)
                    }
                    res.status(200).json({message: 'Register success.'}).send()
                }
            }
        } catch (error) {
            res.status(401).json({message: error}).send()
        }
    })
    // end register

    // OLD

    router.post('/api/countAdvisees', adminOnly, async (req, res) => {
        try {
            const adviserId = req.user.id // get the id of the current adviser
            const source = './database/db.sqlite'
            const db = await database.openOrCreateDB(source)
            const rows = await database.get(db, `
        SELECT COUNT(*) AS count FROM user
        WHERE role = 'student' AND adviser_id = ?
    `, [adviserId], false)
            res.json({ 'count': rows.count }).send()
        } catch (error) {
            console.log('error on /api/countAdvisees')
            console.log(error)
            res.status(401).json({ message: error }).send()
        }
    })

    // edit user
    router.post('/api/editUser', adminOnly, async (req, res) => {
        try {
            // body checker
            if (!req.body.role || !req.body.up_mail || !req.body.first_name || !req.body.middle_name || !req.body.last_name) {
                // invalid body
                throw 'Invalid request body'
            } else {
                const source = './database/db.sqlite'
                const db = await database.openOrCreateDB(source)
                const row = await database.get(db, `
        SELECT * FROM user WHERE up_mail = ?
        `, [req.user.up_mail], false)
                if (row) {
                    // user with up_mail exists
                    // update user
                    await database.run(db, `
            UPDATE user SET role = ?, first_name = ?, middle_name = ?, last_name = ?, degree_program = ?, sais_id = ?, student_number = ?, adviser_up_mail = ?, department = ? WHERE up_mail = ?
        `, [req.body.role.toLowerCase(), req.body.first_name.toLowerCase(), req.body.middle_name.toLowerCase(), req.body.last_name.toLowerCase(), req.body.degree_program.toLowerCase(), req.body.sais_id.toLowerCase(), req.body.student_number.toLowerCase(), req.body.adviser_up_mail.toLowerCase(), req.body.department.toLowerCase(), req.body.up_mail.toLowerCase()], false)
                    res.send('Edit success.')
                } else {
                    throw 'No user with that upmail'
                }
            }
        } catch (error) {
            console.log('Error on /api/editUser')
            console.log(error)
            res.status(401).send(error)
        }
    })
    // end edit user

    // delete user
    router.post('/api/deleteUser', adminOnly, async (req, res) => {
        try {
            // body checker
            if (!req.body.up_mail) {
                // invalid body
                throw 'Invalid request body'
            } else {
                const source = './database/db.sqlite'
                const db = await database.openOrCreateDB(source)
                const row = await database.get(db, `
        SELECT * FROM user WHERE up_mail = ?
        `, [req.user.up_mail], false)
                if (row) {
                    // user with up_mail exists
                    // delete user
                    await database.run(db, `
            DELETE FROM user WHERE up_mail = ?
        `, [req.body.up_mail], false)
                    res.send('Delete success.')
                } else {
                    throw 'No user with that upmail'
                }
            }
        } catch (error) {
            console.log('Error on /api/deleteUser')
            console.log(error)
            res.status(401).send(error)
        }
    })
    // end delete user

    app.use('/', router)
}

// Middlewares
function adminOnly(req, res, next) {
    try {
        if (req.user.role !== 'admin') {
            throw 'Unauthorized'
        } else {
            next()
        }
    } catch (error) {
        res.status(401).json({message: error}).send()
    }
}
// end Middlewares

module.exports = { main }