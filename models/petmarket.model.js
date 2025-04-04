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

const getPetTypeModel = async () => {
  const query = "SELECT * FROM pet_type";
  const formattedQuery = format(query);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const getCategoryModel = async () => {
  const query = "SELECT * FROM category";
  const formattedQuery = format(query);
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

const updateUserProfileModel = async ({
  userId,
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
    "WITH updated_user AS (" +
    "UPDATE users SET " +
    "user_name = %L, " +
    "password = %L, " +
    "email = %L, " +
    "update_date = CURRENT_TIMESTAMP " +
    "WHERE id_user = %L RETURNING id_user" +
    ")UPDATE user_profile SET " +
    "id_region = %L, " +
    "id_commune = %L, " +
    "name = %L, " +
    "first_surname = %L, " +
    "second_surname = %L, " +
    "street = %L, " +
    "street_number = %L, " +
    "phone = %L, " +
    "url_img_profile = %L, " +
    "update_date = CURRENT_TIMESTAMP " +
    "WHERE id_user = (SELECT id_user FROM updated_user) RETURNING *";

  const formattedQuery = format(
    query,
    userName,
    password,
    email,
    userId,
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

const postCreatePostModel = async ({
  userId,
  categoryId,
  productName,
  brand,
  weightKg,
  price,
  sale,
  discountPercentage,
  petType,
  title,
  simpleDescription,
  fullDescription,
  stock,
  available,
  urlImage,
}) => {
  const query =
    "WITH inserted_product AS (" +
    "INSERT INTO product (id_category, name, brand, weight_kg, price, sale, discount_percentage) " +
    "VALUES (%L, %L, %L, %L, %L, %L, %L) " +
    "RETURNING *" +
    "), " +
    "inserted_product_pet_type AS (" +
    "INSERT INTO product_pet_type (id_product, id_pet_type)" +
    "VALUES ((SELECT id_product FROM inserted_product), %L)" +
    "RETURNING id_product, id_pet_type" +
    "), " +
    "inserted_post AS (" +
    "INSERT INTO post (id_user, id_product, title, simple_description, full_description, stock, available) " +
    "VALUES (%L, (SELECT id_product FROM inserted_product), %L, %L, %L, %L, %L) " +
    "RETURNING * " +
    "), " +
    "inserted_post_image AS (" +
    "INSERT INTO post_image (id_post, url_image) " +
    "VALUES ((SELECT id_post FROM inserted_post), %L) " +
    "RETURNING *" +
    ")" +
    "SELECT " +
    "ip.id_product, ip.id_category, ip.name AS product_name, ip.brand, ip.weight_kg, ip.price, ip.sale, ip.discount_percentage, " +
    "ippt.id_pet_type, " +
    "ipst.id_post, ipst.id_user, ipst.title, ipst.simple_description, ipst.full_description, ipst.stock, ipst.available, ipst.creation_date AS post_creation_date, ipst.update_date AS post_update_date, " +
    "ipi.id_post_image, ipi.url_image " +
    "FROM inserted_product ip " +
    "JOIN inserted_post ipst ON ipst.id_product = ip.id_product " +
    "JOIN inserted_post_image ipi ON ipi.id_post = ipst.id_post " +
    "JOIN inserted_product_pet_type ippt ON ippt.id_product = ip.id_product";

  const formattedQuery = format(
    query,
    categoryId,
    productName,
    brand,
    weightKg,
    price,
    sale,
    discountPercentage,
    petType,
    userId,
    title,
    simpleDescription,
    fullDescription,
    stock,
    available,
    urlImage,
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
  getPetTypeModel,
  getCategoryModel,
  postRegisterModel,
  postLoginModel,
  getUserProfileModel,
  updateUserProfileModel,
  postCreatePostModel,
  updatePostModel,
  deletePostModel,
};
