import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  allowExitOnIdle: true,
});
