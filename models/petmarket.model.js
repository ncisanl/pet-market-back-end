import format from "pg-format";
import { pool } from "../database/connection.js";

const getRegionsModel = async () => {
  const query = "SELECT * FROM region";
  const formattedQuery = format(query);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const getCommunesModel = async (regionId) => {
  const query = "SELECT * FROM commune WHERE id_region = %L";
  const formattedQuery = format(query, regionId);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

export const petMarketModel = {
  getRegionsModel,
  getCommunesModel,
};
