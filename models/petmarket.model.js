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

const postRegisterModel = async ({
  userName,
  password,
  email,
  idRegion,
  idCommune,
  name,
  firstSurname,
  secondSurname,
  street,
  streetNumber,
  phone,
  urlImgProfile,
}) => {
  const query =
    "WITH inserted_user AS (" +
    "INSERT INTO users (" +
    "user_name, " +
    "password, " +
    "email" +
    ") VALUES (%L, %L, %L) RETURNING id_user) " +
    "INSERT INTO user_profile (" +
    "id_user, " +
    "id_region, " +
    "id_commune, " +
    "name, " +
    "first_surname, " +
    "second_surname, " +
    "street, " +
    "street_number, " +
    "phone, " +
    "url_img_profile" +
    ") VALUES ((SELECT id_user FROM inserted_user), %L, %L, %L, %L, %L, %L, %L, %L, %L) " +
    "RETURNING id_user_profile";

  const formattedQuery = format(
    query,
    userName,
    password,
    email,
    idRegion,
    idCommune,
    name,
    firstSurname,
    secondSurname,
    street,
    streetNumber,
    phone,
    urlImgProfile,
  );

  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const postLoginModel = async (userName) => {
  const query = "SELECT * FROM users WHERE user_name = %L";
  const formattedQuery = format(query, userName);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const getUserProfileModel = async (userId) => {
  const query =
    "SELECT user_name, email, id_region, id_commune, name, first_surname, second_surname, street, street_number, phone, url_img_profile " +
    "FROM users " +
    "INNER JOIN user_profile ON users.id_user = user_profile.id_user " +
    "WHERE users.id_user = %L";
  const formattedQuery = format(query, userId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const postCreatePostModel = async ({
  id_user,
  id_product,
  title,
  simple_description,
  full_description,
  stock,
  available,
}) => {
  const query =
    "INSERT INTO post (" +
    "id_user, " +
    "id_product, " +
    "title, " +
    "simple_description, " +
    "full_description, " +
    "stock, " +
    "available, " +
    "creation_date, " +
    "update_date" +
    ") VALUES (%L, %L, %L, %L, %L, %L, %L, NOW(), NOW()) RETURNING *";
  const formattedQuery = format(
    query,
    id_user,
    id_product,
    title,
    simple_description,
    full_description,
    stock,
    available,
  );
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const updatePostModel = async (
  id_post,
  { title, simple_description, full_description, stock, available },
) => {
  const query =
    "UPDATE post SET " +
    "title = %L, " +
    "simple_description = %L, " +
    "full_description = %L, " +
    "stock = %L, " +
    "available = %L, " +
    "update_date = NOW() " +
    "WHERE id_post = %L RETURNING *";
  const formattedQuery = format(
    query,
    title,
    simple_description,
    full_description,
    stock,
    available,
    id_post,
  );
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const deletePostModel = async (id_post) => {
  const query = "DELETE FROM post WHERE id_post = %L RETURNING *";
  const formattedQuery = format(query, id_post);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

export const petMarketModel = {
  getRegionsModel,
  getCommunesModel,
  postRegisterModel,
  postLoginModel,
  getUserProfileModel,
  postCreatePostModel,
  updatePostModel,
  deletePostModel,
};
