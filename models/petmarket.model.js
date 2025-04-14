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
    "SELECT user_name, password, email, id_region, id_commune, name, first_surname, second_surname, street, street_number, phone, url_img_profile " +
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

const updatePostModel = async ({
  postId,
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
    "WITH updated_product AS ( " +
    "UPDATE product " +
    "SET id_category = %L, " +
    "name = %L, " +
    "brand = %L, " +
    "weight_kg = %L, " +
    "price = %L, " +
    "sale = %L, " +
    "discount_percentage = %L " +
    "WHERE id_product = (SELECT id_product FROM post WHERE id_post = %L) " +
    "RETURNING * " +
    "), " +
    "updated_product_pet_type AS ( " +
    "UPDATE product_pet_type " +
    "SET id_pet_type = %L " +
    "WHERE id_product = (SELECT id_product FROM updated_product) " +
    "RETURNING * " +
    "), " +
    "updated_post AS ( " +
    "UPDATE post " +
    "SET title = %L, " +
    "simple_description = %L, " +
    "full_description = %L, " +
    "stock = %L, " +
    "available = %L, " +
    "update_date = CURRENT_TIMESTAMP " +
    "WHERE id_post = %L RETURNING * " +
    "), " +
    "updated_post_image AS ( " +
    "UPDATE post_image " +
    "SET url_image = %L " +
    "WHERE id_post = %L " +
    "RETURNING * " +
    ") " +
    "SELECT " +
    "up.*, " +
    "uppt.id_pet_type, " +
    "uPost.*, " +
    "upi.* " +
    "FROM updated_product up " +
    "JOIN updated_product_pet_type uppt ON uppt.id_product = up.id_product " +
    "JOIN updated_post uPost ON uPost.id_product = up.id_product " +
    "JOIN updated_post_image upi ON upi.id_post = uPost.id_post";

  const formattedQuery = format(
    query,
    categoryId,
    productName,
    brand,
    weightKg,
    price,
    sale,
    discountPercentage,
    postId,
    petType,
    title,
    simpleDescription,
    fullDescription,
    stock,
    available,
    postId,
    urlImage,
    postId,
  );
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const deletePostModel = async (postId) => {
  const query =
    "WITH deleted_post_image AS ( " +
    "DELETE FROM post_image " +
    "WHERE id_post = %L " +
    "RETURNING id_post " +
    "), " +
    "deleted_post AS ( " +
    "DELETE FROM post " +
    "WHERE id_post = %L " +
    "RETURNING id_product " +
    "), " +
    "deleted_product_pet_type AS ( " +
    "DELETE FROM product_pet_type " +
    "WHERE id_product = (SELECT id_product FROM deleted_post) " +
    "RETURNING id_product " +
    "), " +
    "deleted_product AS ( " +
    "DELETE FROM product " +
    "WHERE id_product = (SELECT id_product FROM deleted_post) " +
    "RETURNING * " +
    ") " +
    "SELECT dp.* FROM deleted_product dp";

  const formattedQuery = format(query, postId, postId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const getPostDetailModel = async (postId) => {
  const query =
    "SELECT " +
    "  p.id_post, " +
    "  p.title, " +
    "  p.simple_description, " +
    "  p.full_description, " +
    "  p.stock, " +
    "  p.available, " +
    "  p.creation_date AS post_creation_date, " +
    "  p.update_date AS post_update_date, " +
    "  pr.id_product, " +
    "  pr.id_category, " +
    "  pr.name AS product_name, " +
    "  pr.brand, " +
    "  pr.weight_kg, " +
    "  pr.price, " +
    "  pr.sale, " +
    "  pr.discount_percentage, " +
    "  ppt.id_pet_type, " +
    "  pi.url_image " +
    "FROM post p " +
    "JOIN product pr ON pr.id_product = p.id_product " +
    "LEFT JOIN product_pet_type ppt ON ppt.id_product = pr.id_product " +
    "LEFT JOIN post_image pi ON pi.id_post = p.id_post " +
    "WHERE p.id_post = %L";
  const formattedQuery = format(query, postId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const getPostModel = async () => {
  const query =
    "SELECT " +
    "p.id_post, " +
    "p.id_product, " +
    "p.title, " +
    "p.simple_description, " +
    "p.full_description, " +
    "p.stock, " +
    "p.available, " +
    "pi.url_image, " +
    "pr.id_category, " +
    "pr.name AS product_name, " +
    "pr.brand, " +
    "pr.weight_kg, " +
    "pr.price, " +
    "pr.sale, " +
    "pr.discount_percentage, " +
    "ppt.id_pet_type " +
    "FROM post p " +
    "JOIN product pr ON pr.id_product = p.id_product " +
    "JOIN post_image pi ON pi.id_post = p.id_post " +
    "JOIN product_pet_type ppt ON ppt.id_product = p.id_product";

  const formattedQuery = format(query);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const getMyPostsModel = async (userId) => {
  const query =
    "SELECT " +
    "  p.id_post, " +
    "  p.id_product, " +
    "  p.title, " +
    "  p.simple_description, " +
    "  p.full_description, " +
    "  p.stock, " +
    "  p.available, " +
    "  pi.url_image, " +
    "  pr.id_category, " +
    "  pr.name AS product_name, " +
    "  pr.brand, " +
    "  pr.weight_kg, " +
    "  pr.price, " +
    "  pr.sale, " +
    "  pr.discount_percentage, " +
    "  ppt.id_pet_type " +
    "FROM post p " +
    "JOIN product pr ON pr.id_product = p.id_product " +
    "JOIN post_image pi ON pi.id_post = p.id_post " +
    "JOIN product_pet_type ppt ON ppt.id_product = p.id_product " +
    "WHERE p.id_user = %L";
  const formattedQuery = format(query, userId);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const getPostCategoryPetTypeModel = async ({ petTypeId, categoryId }) => {
  const query =
    "SELECT " +
    "p.id_post, " +
    "p.id_product, " +
    "p.title, " +
    "p.simple_description, " +
    "p.full_description, " +
    "p.stock, " +
    "p.available, " +
    "pi.url_image, " +
    "pr.id_category, " +
    "pr.name AS product_name, " +
    "pr.brand, " +
    "pr.weight_kg, " +
    "pr.price, " +
    "pr.sale, " +
    "pr.discount_percentage, " +
    "ppt.id_pet_type " +
    "FROM post p " +
    "JOIN product pr ON pr.id_product = p.id_product " +
    "JOIN post_image pi ON pi.id_post = p.id_post " +
    "JOIN product_pet_type ppt ON ppt.id_product = p.id_product " +
    "WHERE ppt.id_pet_type = %L " +
    "AND pr.id_category = %L";

  const formattedQuery = format(query, petTypeId, categoryId);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const postAddPostFavoriteModel = async ({ userId, postId }) => {
  const query =
    "WITH inserted_favorite AS ( " +
    "INSERT INTO favorite (id_user) " +
    "VALUES (%L) " +
    "RETURNING id_favorite " +
    ") " +
    "INSERT INTO post_favorite (id_favorite, id_post, favorite) " +
    "VALUES ((SELECT id_favorite FROM inserted_favorite), %L, TRUE) " +
    "RETURNING *";

  const formattedQuery = format(query, userId, postId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const deletePostFavoriteModel = async (favoriteId) => {
  const query =
    "WITH deleted_post_favorite AS ( " +
    "DELETE FROM post_favorite " +
    "WHERE id_favorite = %L " +
    "RETURNING * " +
    ") " +
    "DELETE FROM favorite " +
    "WHERE id_favorite = %L " +
    "RETURNING *";

  const formattedQuery = format(query, favoriteId, favoriteId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const getUserFavoriteModel = async (userId) => {
  const query =
    "SELECT " +
    "  f.id_favorite, " +
    "  pf.id_post, " +
    "  p.title, " +
    "  p.simple_description, " +
    "  p.full_description, " +
    "  p.stock, " +
    "  p.available, " +
    "  p.creation_date AS post_creation_date, " +
    "  p.update_date AS post_update_date, " +
    "  pr.id_product, " +
    "  pr.id_category, " +
    "  pr.name AS product_name, " +
    "  pr.brand, " +
    "  pr.weight_kg, " +
    "  pr.price, " +
    "  pr.sale, " +
    "  pr.discount_percentage, " +
    "  pf.favorite AS post_favorite, " +
    "  pf.creation_date AS pf_creation_date, " +
    "  pf.update_date AS pf_update_date, " +
    "  ppt.id_pet_type, " +
    "  pi.url_image " +
    "FROM favorite f " +
    "JOIN post_favorite pf ON pf.id_favorite = f.id_favorite " +
    "JOIN post p ON p.id_post = pf.id_post " +
    "JOIN product pr ON pr.id_product = p.id_product " +
    "LEFT JOIN product_pet_type ppt ON ppt.id_product = pr.id_product " +
    "LEFT JOIN post_image pi ON pi.id_post = p.id_post " +
    "WHERE f.id_user = %L";
  const formattedQuery = format(query, userId);
  const { rows } = await pool.query(formattedQuery);
  return rows;
};

const postCreateCartModel = async ({ userId, postId, quantity = 1 }) => {
  const query =
    "WITH inserted_cart AS ( " +
    "INSERT INTO cart (id_user) " +
    "VALUES (%L) " +
    "RETURNING id_cart " +
    ") " +
    "INSERT INTO post_cart (id_cart, id_post, quantity) " +
    "VALUES ((SELECT id_cart FROM inserted_cart), %L, %L) " +
    "RETURNING *";

  const formattedQuery = format(query, userId, postId, quantity);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const postAddPostCartModel = async ({ cartId, postId, quantity = 1 }) => {
  const checkQuery =
    "SELECT * FROM post_cart WHERE id_cart = %L AND id_post = %L";
  const formattedCheckQuery = format(checkQuery, cartId, postId);
  const { rows: existing } = await pool.query(formattedCheckQuery);

  if (existing.length > 0) {
    return {
      success: false,
      message: "Este producto ya se encuentra en el carrito",
    };
  }

  const query =
    "INSERT INTO post_cart (" +
    "id_cart, " +
    "id_post, " +
    "quantity" +
    ") " +
    "VALUES (%L, %L, %L) " +
    "RETURNING *";

  const formattedQuery = format(query, cartId, postId, quantity);
  const { rows } = await pool.query(formattedQuery);
  return {
    success: true,
    data: rows[0],
    message: "Producto agregado al carrito correctamente",
  };
};

const updatePostCartModel = async ({ cartId, postId, quantity }) => {
  const query =
    "UPDATE post_cart " +
    "SET quantity = %L, " +
    "update_date = CURRENT_TIMESTAMP " +
    "WHERE id_cart = %L AND id_post = %L " +
    "RETURNING *";

  const formattedQuery = format(query, quantity, cartId, postId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const deletePostCartModel = async ({ cartId, postId }) => {
  const query =
    "DELETE FROM post_cart " +
    "WHERE id_cart = %L AND id_post = %L " +
    "RETURNING *";

  const formattedQuery = format(query, cartId, postId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const deleteCartModel = async (cartId) => {
  const query =
    "WITH deleted_post_cart AS ( " +
    "DELETE FROM post_cart " +
    "WHERE id_cart = %L " +
    "RETURNING * " +
    ") " +
    "DELETE FROM cart " +
    "WHERE id_cart = %L " +
    "RETURNING *";

  const formattedQuery = format(query, cartId, cartId);
  const { rows } = await pool.query(formattedQuery);
  return rows[0];
};

const getCartPostModel = async (userId) => {
  const query =
    "SELECT " +
    "c.id_cart, " +
    "c.id_user, " +
    "c.creation_date AS cart_creation_date, " +
    "pc.id_post, " +
    "pc.quantity, " +
    "pc.creation_date AS post_cart_creation, " +
    "pc.update_date AS post_cart_update, " +
    "p.title, " +
    "p.simple_description, " +
    "p.full_description, " +
    "p.stock, " +
    "p.available, " +
    "p.creation_date AS post_creation_date, " +
    "p.update_date AS post_update_date, " +
    "pr.id_product, " +
    "pr.id_category, " +
    "pr.name AS product_name, " +
    "pr.brand, " +
    "pr.weight_kg, " +
    "pr.price, " +
    "pr.sale, " +
    "pr.discount_percentage, " +
    "ppt.id_pet_type, " +
    "pi.url_image " +
    "FROM cart c " +
    "JOIN post_cart pc ON c.id_cart = pc.id_cart " +
    "JOIN post p ON pc.id_post = p.id_post " +
    "JOIN product pr ON p.id_product = pr.id_product " +
    "JOIN product_pet_type ppt ON pr.id_product = ppt.id_product " +
    "LEFT JOIN post_image pi ON p.id_post = pi.id_post " +
    "WHERE c.id_user = %L";

  const formattedQuery = format(query, userId);
  const { rows } = await pool.query(formattedQuery);
  return rows;
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
  getPostDetailModel,
  getPostModel,
  getMyPostsModel,
  getPostCategoryPetTypeModel,
  postAddPostFavoriteModel,
  deletePostFavoriteModel,
  getUserFavoriteModel,
  postCreateCartModel,
  postAddPostCartModel,
  updatePostCartModel,
  deletePostCartModel,
  deleteCartModel,
  getCartPostModel,
};
