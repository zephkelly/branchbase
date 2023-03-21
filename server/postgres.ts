//@ts-ignore
import pg from 'pg';
import { Nitro } from 'nitropack';

import dotenv from 'dotenv';
dotenv.config();

export const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
});

export default async (_nitroApp: Nitro) => {
  try {
    await pool.connect();
    console.log("DB connection established.");
  }
  catch (err) {
    console.error("DB connection failed.", err);
  }
}