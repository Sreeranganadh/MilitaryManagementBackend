// const fs = require('fs');
// const path = require('path');
// const { Client } = require('pg');
// const readline = require('readline');

// function ask(question, defaultValue) {
//   const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
//   const q = defaultValue ? `${question} (default: ${defaultValue}): ` : `${question}: `;
//   return new Promise((resolve) => {
//     rl.question(q, (answer) => {
//       rl.close();
//       if (!answer && defaultValue !== undefined) return resolve(defaultValue);
//       resolve(answer);
//     });
//   });
// }

// async function main() {
//   try {
//     console.log('This script will create a PostgreSQL database and apply the schema in database.sql');

//     const host = await ask('Postgres host', process.env.PGHOST || 'localhost');
//     const port = parseInt(await ask('Postgres port', process.env.PGPORT || '5432'), 10);
//     const user = await ask('Postgres admin user', process.env.PGUSER || 'postgres');
//     const password = process.env.PGPASSWORD || await ask('Postgres admin password (will be echoed)');
//     const dbName = await ask('Database name to create', process.env.DB_NAME || 'military_assets');

//     const schemaPath = path.join(__dirname, 'database.sql');
//     if (!fs.existsSync(schemaPath)) {
//       console.error('Schema file not found:', schemaPath);
//       process.exit(1);
//     }

//     const adminClient = new Client({ host, port, user, password, database: 'postgres' });
//     await adminClient.connect();

//     const res = await adminClient.query("SELECT 1 FROM pg_database WHERE datname=$1", [dbName]);
//     if (res.rowCount > 0) {
//       const drop = (await ask(`Database '${dbName}' exists. Drop and recreate? (y/N)`, 'N')).toLowerCase();
//       if (drop === 'y' || drop === 'yes') {
//         console.log(`Terminating connections and dropping database ${dbName}...`);
//         // Terminate connections, then drop
//         await adminClient.query(`REVOKE CONNECT ON DATABASE \"${dbName}\" FROM public`);
//         await adminClient.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`, [dbName]);
//         await adminClient.query(`DROP DATABASE \"${dbName}\"`);
//         console.log('Dropped.');
//         await adminClient.query(`CREATE DATABASE \"${dbName}\"`);
//         console.log(`Created database ${dbName}.`);
//       } else {
//         console.log(`Keeping existing database ${dbName} and importing schema into it.`);
//       }
//     } else {
//       console.log(`Creating database ${dbName}...`);
//       await adminClient.query(`CREATE DATABASE \"${dbName}\"`);
//       console.log('Created.');
//     }

//     await adminClient.end();

//     // Read schema and run it against the target database
//     const schemaSql = fs.readFileSync(schemaPath, 'utf8');
//     const targetClient = new Client({ host, port, user, password, database: dbName });
//     await targetClient.connect();

//     console.log('Applying schema...');
//     // Some SQL files contain multiple statements; pg supports them in a single query.
//     await targetClient.query(schemaSql);

//     console.log('Schema applied successfully.');
//     await targetClient.end();

//   } catch (err) {
//     console.error('Error:', err.message || err);
//     process.exit(1);
//   }
// }

// main();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAndSeed() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf-8');

    // Run SQL script (multiple statements)
    await pool.query(sql);

    console.log('Tables created and data inserted successfully.');
  } catch (err) {
    console.error('Error running SQL script:', err);
  } finally {
    pool.end();
  }
}

createAndSeed();

