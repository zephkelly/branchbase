const { Pool } = require('pg');
require('dotenv').config();

export default defineNuxtPlugin(async (nuxtContext) => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
  });

  try {
    await pool.connect();
    console.log("DB connection established.");
  }
  catch (err) {
    console.error("DB connection failed.", err);
  }
});