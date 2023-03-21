const { Pool } = require('pg');
require('dotenv').config();

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
});

export default defineNuxtPlugin(async (nuxtContext) => {
  try {
    await pool.connect();
    console.log("DB connection established.");
  }
  catch (err) {
    console.error("DB connection failed.", err);
  }
});