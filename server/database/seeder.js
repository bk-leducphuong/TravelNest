const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");

const CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "19122004",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
};

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function connectToDatabase() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const connection = await mysql.createConnection(CONFIG);
      await connection.connect();
      return connection;
    } catch (err) {
      console.log("⏳ Waiting for MySQL...");
      await delay(RETRY_DELAY);
    }
  }
  throw new Error("❌ Failed to connect to MySQL");
}

async function executeSeedQueries(connection) {
  const seedQueries = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

  try {
    const results = await connection.query(seedQueries);
    console.log("Database seeded successfully:", results);
  } catch (error) {
    console.error("Error executing seed queries:", error);
    throw error;
  }
}

async function seeder() {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log("✅ Connected to MySQL");

    await executeSeedQueries(connection);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seeder();
