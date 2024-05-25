const { exec } = require("node:child_process");
const { sequelize, User } = require("../../models");

// wrap common exec call to thenable function
function execCommand(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// more info about Node.js childproccess see https://nodejs.org/api/child_process.html
async function startDb() {
  // if db already running then return
  const dbUp = await isDbUp();
  if (dbUp) {
    return;
  }
  console.log("Starting database...");
  const command =
    "docker-compose -f .\\docker-compose.yml up -d --build postgres flyway";
  const options = {
    cwd: __dirname,
  };
  const { stdout, stderr } = await execCommand(command, options);
  // the default timeout is 10000ms. To change this, pass a different value in milliseconds to this function
  await waitDbReady();
  console.log("Database started");
}

async function stopDb() {
  const command = "docker-compose -f .\\docker-compose.yml down";
  const options = {
    cwd: __dirname,
  };
  const { stdout, stderr } = await execCommand(command, options);
  console.log("Database stopped");
}

async function waitDbReady(timeoutMillis = 10000) {
  const lastMigrationVersion = getLatestMigrationVersion();
  const startMillis = Date.now();
  while (true) {
    // sleep for half a second
    await sleep(500);
    const proccessTime = Date.now() - startMillis;
    let errorMessage = "";
    try {
      const appliedMigration = await geLastDbAppliedMigration();
      // check if applied migration is equal to last migration file version
      if (appliedMigration === lastMigrationVersion) {
        console.log(
          `Latest applied migration verison ${appliedMigration} is set up. Migration time ${proccessTime}ms`
        );
        return;
      }
    } catch (error) {
      errorMessage = "connecting to db ...";
      if (errorMessage !== "") {
        console.log(errorMessage);
      }
    }

    // in case of timeout
    if (proccessTime >= timeoutMillis) {
      console.log(`Process duration exeeded timeout of ${timeoutMillis}ms`);
      return;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geLastDbAppliedMigration() {
  try {
    const sql =
      'SELECT max(cast("version" as int))as version from flyway_schema_history';
    const result = await dbSelect(sql);
    return result[0].version;
  } catch (error) {}
  return -1;
}

async function isDbUp() {
  try {
    const result = await dbSelect("select 1 one");
    if (result && result[0].one === 1) {
      console.log(result[0]);
      return true;
    }
  } catch (error) {
    return false;
  }
}

async function truncateAllTables() {
  let returnValue = false;
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== "testing") {
    return returnValue;
  }

  try {
    const sql = `DO $$
    DECLARE row RECORD;
    BEGIN
      FOR row IN SELECT table_name
        FROM information_schema.tables
        WHERE table_type='BASE TABLE'
        AND table_schema='public'
        AND table_name NOT IN ('flyway_schema_history') 
      LOOP 
        EXECUTE format('TRUNCATE TABLE %I CONTINUE IDENTITY CASCADE;',row.table_name);
      END LOOP;
    END;
    $$;`;
    const result = await dbSelect(sql);
    returnValue = true;
  } catch (error) {
    console.log(error);
  }
  return returnValue;
}

async function dbSelect(sql, params = []) {
  const { Client } = require("pg");
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });
  try {
    await client.connect();
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

function getLatestMigrationVersion() {
  const fs = require("fs");
  const path = require("node:path");
  const migrationFileRegex = /^V\d+__.+\.sql$/;
  const migrationFolder = path.resolve(
    process.cwd(),
    "support",
    "migrations",
    "sql"
  );
  const filenames = fs
    .readdirSync(migrationFolder)
    .filter((file) => migrationFileRegex.test(file));

  const migrationVersion = filenames.reduce((result, current) => {
    const currentVersion = parseInt(current.split("__")[0].replace("V", ""));
    return currentVersion > result ? currentVersion : result;
  }, -1);
  return migrationVersion;
}

// loads testing .env variables if not loaded yet
function setTestingEnv() {
  const path = require("node:path");
  const envPath = path.resolve(process.cwd(), "test", "support", ".env");
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== "testing") {
    require("dotenv").config({ path: envPath });
  }
}

/**
 * @param {object} userData - object with user data
 */
async function createRegularUser(userData) {
  const defaultData = {
    firstName: "Testing",
    lastName: "User",
    email: "testing.user@mail.test",
    password: "testingpassword",
  };
  const data = { ...defaultData, ...userData, isAdmin: false };
  const user = await User.create(data);
  return user;
}

/**
 * @param {object} userData - object with user data
 */
async function createAdminUser(userData) {
  const defaultData = {
    firstName: "Admin",
    lastName: "User",
    email: "admin.user@mail.test",
    password: "adminpassword",
  };
  const data = { ...defaultData, ...userData, isAdmin: true };
  const user = await User.create(data);
  return user;
}

async function getUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

module.exports = {
  startDb,
  stopDb,
  truncateAllTables,
  createAdminUser,
  createRegularUser,
  getUserByEmail,
};

// Testing functions
(async () => {
  setTestingEnv();
  let result;
  //stopDb();
  //startDb();
  //result = dbSelect("select now()");
  //const connres = await detectDbConnectivity();
  //console.log(connres);
  //await waitDbReady();
  //result = await geLastDbAppliedMigration();

  //result = await truncateAllTables();
  result = await isDbUp();
  if (result) {
    console.log(result);
  }
})();
