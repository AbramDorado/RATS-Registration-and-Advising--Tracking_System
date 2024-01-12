const { v4: uuidv4 } = require('uuid');
const database = require('./database');
const fs = require('fs');
const csv = require('csv-parser');

async function main(db) {
  //csv file insertions
  await createInitialTables(db)
  await createInitialRows(db)
  await processCsv1()
  await processCsv2()
  await processCsv3()
  // await processCsv4()
  // await processCsv5()
  // await processCsv6()
  // await processCsv7()
  // await processCsv8()
}

async function createInitialTables(db) {

  // user table
  await database.createTable(db, 'user', `
    id SERIAL PRIMARY KEY,
    role TEXT,
    up_mail TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    degree_program TEXT,
    sais_id TEXT,
    student_number TEXT,
    adviser_up_mail TEXT,
    department TEXT
  `)
  // end user table

  // announcement table
  await database.createTable(db, 'announcement', `
    id SERIAL PRIMARY KEY,
    title TEXT,
    body TEXT UNIQUE,
    created TIMESTAMP,
    modified TIMESTAMP
  `)
  // end announcement table

  // advising_status table
  await database.createTable(db, 'advising_status', `
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    adviser_up_mail TEXT,
    degree_program TEXT,
    department TEXT,
    step1_status TEXT,
    step2_status TEXT,
    step3_status TEXT,
    remarks TEXT
  `)
  // end advising_status table

  // course table
  await database.createTable(db, 'course', `
    class_number TEXT UNIQUE PRIMARY KEY,
    department TEXT,
    course_title TEXT,
    subject TEXT,
    catalog_no TEXT,
    section TEXT,
    component TEXT,
    schedule TEXT,
    learning_delivery_mode TEXT,
    room_assigned TEXT,
    instructor TEXT,
    class_capacity TEXT,
    restrictions TEXT,
    units TEXT
  `)
  // end course table

  // course_edit table
  await database.createTable(db, 'course_edit', `
    class_number TEXT UNIQUE PRIMARY KEY,
    subject TEXT,
    catalog_no TEXT,
    section TEXT,
    modification TEXT,
    notes TEXT,
    last_modified TEXT
  `)
  // end course_edit table

  // curri_progress table
  await database.createTable(db, 'curri_progress', `
    student_up_mail TEXT UNIQUE PRIMARY KEY,
    curri_progress TEXT,
    created TEXT,
    modified TEXT
  `)
  // end curri_progress table

  // ecf table
  await database.createTable(db, 'ecf', `
    id SERIAL PRIMARY KEY,
    student_up_mail TEXT,
    class_number TEXT,
    adviser_up_mail TEXT
  `)
  // end ecf table

  // global_variables table
  await database.createTable(db, 'global_variables',
    `key TEXT UNIQUE PRIMARY KEY,
    value TEXT
  `)
  // end global_variables table

  // grade table
  await database.createTable(db, 'grade', `
    id SERIAL PRIMARY KEY,
    year_level TEXT,
    semester TEXT,
    units INT,
    subject TEXT,
    grade TEXT,
    student_up_mail TEXT
  `)
  // end grade table

  // degree_programs table
  await database.createTable(db, 'degree_programs',`
    id SERIAL PRIMARY KEY,
    name TEXT,
    department TEXT,
    total_units INT
  `);
  // end degree_programs table
}


async function createInitialRows() {
  const db = await database.openOrCreateDB();
  const client = await db.connect();
  try {
    await client.query(`
    INSERT INTO advising_status (
      student_up_mail,
      adviser_up_mail,
      department,
      degree_program,
      step1_status,
      step2_status,
      step3_status,
      remarks
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (student_up_mail) DO UPDATE
    SET
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department,
      degree_program = EXCLUDED.degree_program,
      step1_status = EXCLUDED.step1_status,
      step2_status = EXCLUDED.step2_status,
      step3_status = EXCLUDED.step3_status,
      remarks = EXCLUDED.remarks
  `, ['jmlicup@up.edu.ph', 'acdorado2@up.edu.ph', 'dpsm', 'BS Computer Science', 'not started', 'not started', 'no access', 'incomplete grades']);

  await client.query(`
  INSERT INTO advising_status (
    student_up_mail,
    adviser_up_mail,
    department,
    degree_program,
    step1_status,
    step2_status,
    step3_status,
    remarks
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (student_up_mail) DO UPDATE
  SET
    adviser_up_mail = EXCLUDED.adviser_up_mail,
    department = EXCLUDED.department,
    degree_program = EXCLUDED.degree_program,
    step1_status = EXCLUDED.step1_status,
    step2_status = EXCLUDED.step2_status,
    step3_status = EXCLUDED.step3_status,
    remarks = EXCLUDED.remarks
  `, ['abramdorado18@gmail.com', 'acdorado2@up.edu.ph', 'dpsm', 'BS Computer Science', 'not started', 'not started', 'no access', '']);

    await client.query(`
  INSERT INTO global_variables (key, value)
  VALUES ($1, $2)
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value;
`, ['semester', 'Second']);

    await client.query(`
    INSERT INTO global_variables (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value;
  `, ['acad_year', '2022-2023']);

  // Insert Users data

    // Insert student data /////////////////////////////////////////////////////////////////////////////////////////////////////////  
    await client.query(`
    INSERT INTO "user" (
      id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (up_mail) DO UPDATE
    SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      middle_name = EXCLUDED.middle_name,
      degree_program = EXCLUDED.degree_program,
      sais_id = EXCLUDED.sais_id,
      student_number = EXCLUDED.student_number,
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department;
  `, [
      uuidv4(), 'student', 'jmlicup@up.edu.ph', 'John Paolo', 'Licup', 'Dimagiba', 'BS Computer Science', '10008', '2019-46188', 'acdorado2@up.edu.ph', 'dpsm'
    ]);

    await client.query(`
    INSERT INTO "user" (
      id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (up_mail) DO UPDATE
    SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      middle_name = EXCLUDED.middle_name,
      degree_program = EXCLUDED.degree_program,
      sais_id = EXCLUDED.sais_id,
      student_number = EXCLUDED.student_number,
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department;
  `, [
      uuidv4(), 'student', 'abramdorado18@gmail.com', 'Abram', 'Dorado', 'C', 'BS Computer Science', '10008', '2011-11111', 'acdorado2@up.edu.ph', 'dpsm'
    ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Insert admin data /////////////////////////////////////////////////////////////////////////////////////////////////////////
    await client.query(`
    INSERT INTO "user" (
      id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (up_mail) DO UPDATE
    SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      middle_name = EXCLUDED.middle_name,
      degree_program = EXCLUDED.degree_program,
      sais_id = EXCLUDED.sais_id,
      student_number = EXCLUDED.student_number,
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department;
    `, [
      uuidv4(), 'admin', 'jpmlicup@gmail.com', 'John Paolo', 'Licup', 'Dimagiba', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'rlomercado22@gmail.com', 'Russel Lenard', 'Mercado', 'O', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'gdsc.upmanila@gmail.com', 'Admin', 'tset', 'test', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'oysuba@gmail.com', 'Admin', 'test', 'test', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'hdbuizon@gmail.com', 'Admin', 'test', 'test', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'kqpanganiban@gmail.com', 'Admin', 'test', 'test', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'gttrani@gmail.com', 'Admin', 'test', 'test', '', '', '', '', ''
    ]);

    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'admin', 'jdjavier4@gmail.com', 'Admin', 'test', 'test', '', '', '', '', ''
    ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Insert adviser data /////////////////////////////////////////////////////////////////////////////////////////////////////////
    await client.query(`
    INSERT INTO "user" (
      id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (up_mail) DO UPDATE
    SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      middle_name = EXCLUDED.middle_name,
      degree_program = EXCLUDED.degree_program,
      sais_id = EXCLUDED.sais_id,
      student_number = EXCLUDED.student_number,
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department;
  `, [
      uuidv4(), 'adviser', 'romercado1@up.edu.ph', 'Russel Lenard', 'Mercado', 'Middle', '', '', '', '', ''
    ]);

    await client.query(`
    INSERT INTO "user" (
      id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (up_mail) DO UPDATE
    SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      middle_name = EXCLUDED.middle_name,
      degree_program = EXCLUDED.degree_program,
      sais_id = EXCLUDED.sais_id,
      student_number = EXCLUDED.student_number,
      adviser_up_mail = EXCLUDED.adviser_up_mail,
      department = EXCLUDED.department;
      `, [
        uuidv4(), 'adviser', 'vcmagboo@up.edu.ph', 'Vincent Peter', 'Magboo', 'C', '', '', '', '', 'dpsm'
      ]);

      await client.query(`
      INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (up_mail) DO UPDATE
      SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department;
        `, [
          uuidv4(), 'adviser', 'acdorado2@up.edu.ph', 'Adviser', 'test', 'test', '', '', '', '', 'dpsm'
        ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Insert ocs data /////////////////////////////////////////////////////////////////////////////////////////////////////////
    await client.query(
      `INSERT INTO "user" (
        id, role, up_mail, first_name, last_name, middle_name, degree_program, sais_id, student_number, adviser_up_mail, department
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (up_mail)
      DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        middle_name = EXCLUDED.middle_name,
        degree_program = EXCLUDED.degree_program,
        sais_id = EXCLUDED.sais_id,
        student_number = EXCLUDED.student_number,
        adviser_up_mail = EXCLUDED.adviser_up_mail,
        department = EXCLUDED.department
      `, [
      uuidv4(), 'ocs', 'doradobam@gmail.com', 'OCS', 'test', 'test', '', '', '', '', ''
    ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // degree_programs initial data
    await client.query(`
      INSERT INTO "degree_programs" (
        id,
        name,
        department,
        total_units
      ) VALUES (
        1,
        'bs computer science',
        'dpsm',
        172
      )
      ON CONFLICT (id) DO NOTHING;
    `);
    // end degree_programs initial data

  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


////////////////////////////////// If you want to insert data from csv file /////////////////////////////////////////////


//course table
const tableName1 = 'course'; // Replace with your table name

// Replace these with your CSV file path and delimiter
const csvFilePath1 = './csv_initial_data/course.csv';
const csvDelimiter1 = ',';

const processCsv1 = async () => {
  try {
    const stream = fs.createReadStream(csvFilePath1);
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    stream.pipe(csv({ delimiter: csvDelimiter1 }))
      .on('data', async (row) => {
        try {
          // Assuming the CSV column names match the database column names
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row);
          const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

          const query = `
            INSERT INTO ${tableName1} (${columns})
            VALUES (${placeholders})
            ON CONFLICT (class_number)
            DO UPDATE SET
            ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
          `;

          await client.query(query, values);
        } catch (insertError) {
          console.error('Error inserting row:', insertError.message);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        client.release();
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
};

//announcement table
const tableName2 = 'announcement'; // Replace with your table name

// Replace these with your CSV file path and delimiter
const csvFilePath2 = './csv_initial_data/announcement.csv';
const csvDelimiter2 = ',';

const processCsv2 = async () => {
  try {
    const stream = fs.createReadStream(csvFilePath2);
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    stream.pipe(csv({ delimiter: csvDelimiter2 }))
      .on('data', async (row) => {
        try {
          // Assuming the CSV column names match the database column names
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row);
          const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

          const query = `
            INSERT INTO ${tableName2} (${columns})
            VALUES (${placeholders})
            ON CONFLICT (id)
            DO UPDATE SET
            ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
          `;

          await client.query(query, values);
        } catch (insertError) {
          console.error('Error inserting row:', insertError.message);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        client.release();
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
};

//course edit table
const tableName3 = 'course_edit'; // Replace with your table name

// Replace these with your CSV file path and delimiter
const csvFilePath3 = './csv_initial_data/course_edit.csv';
const csvDelimiter3 = ',';

const processCsv3 = async () => {
  try {
    const stream = fs.createReadStream(csvFilePath3);
    const db = await database.openOrCreateDB();
    const client = await db.connect();

    stream.pipe(csv({ delimiter: csvDelimiter3 }))
      .on('data', async (row) => {
        try {
          // Assuming the CSV column names match the database column names
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row);
          const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

          const query = `
            INSERT INTO ${tableName3} (${columns})
            VALUES (${placeholders})
            ON CONFLICT (class_number)
            DO UPDATE SET
            ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
          `;

          await client.query(query, values);
        } catch (insertError) {
          console.error('Error inserting row:', insertError.message);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        client.release();
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
};

// //advising status table
// const tableName4 = 'advising_status'; // Replace with your table name

// // Replace these with your CSV file path and delimiter
// const csvFilePath4 = './csv_initial_data/advising_status.csv';
// const csvDelimiter4 = ',';

// const processCsv4 = async () => {
//   try {
//     const stream = fs.createReadStream(csvFilePath4);
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     stream.pipe(csv({ delimiter: csvDelimiter4 }))
//       .on('data', async (row) => {
//         try {
//           // Assuming the CSV column names match the database column names
//           const columns = Object.keys(row).join(', ');
//           const values = Object.values(row);
//           const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

//           const query = `
//             INSERT INTO ${tableName4} (${columns})
//             VALUES (${placeholders})
//             ON CONFLICT (student_up_mail)
//             DO UPDATE SET
//             ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
//           `;

//           await client.query(query, values);
//         } catch (insertError) {
//           console.error('Error inserting row:', insertError.message);
//         }
//       })
//       .on('end', () => {
//         console.log('CSV file successfully processed.');
//         client.release();
//       });
//   } catch (error) {
//     console.error('Error processing CSV:', error);
//   }
// };


// //curri progress table
// const tableName5 = 'curri_progress'; // Replace with your table name

// // Replace these with your CSV file path and delimiter
// const csvFilePath5 = './csv_initial_data/curri_progress.csv';
// const csvDelimiter5 = ',';

// const processCsv5 = async () => {
//   try {
//     const stream = fs.createReadStream(csvFilePath5);
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     stream.pipe(csv({ delimiter: csvDelimiter5 }))
//       .on('data', async (row) => {
//         try {
//           // Assuming the CSV column names match the database column names
//           const columns = Object.keys(row).join(', ');
//           const values = Object.values(row);
//           const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

//           const query = `
//             INSERT INTO ${tableName5} (${columns})
//             VALUES (${placeholders})
//             ON CONFLICT (student_up_mail)
//             DO UPDATE SET
//             ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
//           `;

//           await client.query(query, values);
//         } catch (insertError) {
//           console.error('Error inserting row:', insertError.message);
//         }
//       })
//       .on('end', () => {
//         console.log('CSV file successfully processed.');
//         client.release();
//       });
//   } catch (error) {
//     console.error('Error processing CSV:', error);
//   }
// };

// //ecf table
// const tableName6 = 'ecf'; // Replace with your table name

// // Replace these with your CSV file path and delimiter
// const csvFilePath6 = './csv_initial_data/ecf.csv';
// const csvDelimiter6 = ',';

// const processCsv6 = async () => {
//   try {
//     const stream = fs.createReadStream(csvFilePath6);
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     stream.pipe(csv({ delimiter: csvDelimiter6 }))
//       .on('data', async (row) => {
//         try {
//           // Assuming the CSV column names match the database column names
//           const columns = Object.keys(row).join(', ');
//           const values = Object.values(row);
//           const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

//           const query = `
//             INSERT INTO ${tableName6} (${columns})
//             VALUES (${placeholders})
//             ON CONFLICT (id)
//             DO UPDATE SET
//             ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
//           `;

//           await client.query(query, values);
//         } catch (insertError) {
//           console.error('Error inserting row:', insertError.message);
//         }
//       })
//       .on('end', () => {
//         console.log('CSV file successfully processed.');
//         client.release();
//       });
//   } catch (error) {
//     console.error('Error processing CSV:', error);
//   }
// };

// //global variables table
// const tableName7 = 'global_variables'; // Replace with your table name

// // Replace these with your CSV file path and delimiter
// const csvFilePath7 = './csv_initial_data/global_variables.csv';
// const csvDelimiter7 = ',';

// const processCsv7 = async () => {
//   try {
//     const stream = fs.createReadStream(csvFilePath7);
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     stream.pipe(csv({ delimiter: csvDelimiter7 }))
//       .on('data', async (row) => {
//         try {
//           // Assuming the CSV column names match the database column names
//           const columns = Object.keys(row).join(', ');
//           const values = Object.values(row);
//           const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

//           const query = `
//             INSERT INTO ${tableName7} (${columns})
//             VALUES (${placeholders})
//             ON CONFLICT (key)
//             DO UPDATE SET
//             ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
//           `;

//           await client.query(query, values);
//         } catch (insertError) {
//           console.error('Error inserting row:', insertError.message);
//         }
//       })
//       .on('end', () => {
//         console.log('CSV file successfully processed.');
//         client.release();
//       });
//   } catch (error) {
//     console.error('Error processing CSV:', error);
//   }
// };


// //user table
// const tableName8 = 'user'; // Replace with your table name

// // Replace these with your CSV file path and delimiter
// const csvFilePath8 = './csv_initial_data/user.csv';
// const csvDelimiter8 = ',';

// const processCsv8 = async () => {
//   try {
//     const stream = fs.createReadStream(csvFilePath8);
//     const db = await database.openOrCreateDB();
//     const client = await db.connect();

//     stream.pipe(csv({ delimiter: csvDelimiter8 }))
//       .on('data', async (row) => {
//         try {
//           // Assuming the CSV column names match the database column names
//           const columns = Object.keys(row).join(', ');
//           const values = Object.values(row);
//           const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

//           const query = `
//             INSERT INTO ${tableName8} (${columns})
//             VALUES (${placeholders})
//             ON CONFLICT (id)
//             DO UPDATE SET
//             ${Object.keys(row).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
//           `;

//           await client.query(query, values);
//         } catch (insertError) {
//           console.error('Error inserting row:', insertError.message);
//         }
//       })
//       .on('end', () => {
//         console.log('CSV file successfully processed.');
//         client.release();
//       });
//   } catch (error) {
//     console.error('Error processing CSV:', error);
//   }
// };

///////////////////////////////////////////////////////////////////////////////

module.exports = { main }