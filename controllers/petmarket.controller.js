import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { petMarketModel } from "../models/petmarket.model.js";
import { getDatabaseError } from "../lib/errors/database.error.js";

const getRegionsController = async (req, res) => {
  try {
    const regions = await petMarketModel.getRegionsModel();

    return res.status(200).json(regions);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCommunesController = async (req, res) => {
  const { regionId } = req.params;

  try {
    const communes = await petMarketModel.getCommunesModel(regionId);

    return res.status(200).json(communes);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPetTypeController = async (req, res) => {
  try {
    const petType = await petMarketModel.getPetTypeModel();

    return res.status(200).json(petType);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCategoryController = async (req, res) => {
  try {
    const category = await petMarketModel.getCategoryModel();

    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const postRegisterController = async (req, res) => {
  const {
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
  } = req.body;

  try {
    await petMarketModel.postRegisterModel({
      userName,
      password: bcrypt.hashSync(password, 10),
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
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const postLoginController = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const userLogger = await petMarketModel.postLoginModel(userName);
    if (!userLogger) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrecta" });
    }

    const matchPassword = bcrypt.compareSync(password, userLogger.password);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrecta" });
    }

    const payload = {
      userName,
      userId: userLogger.id_user,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res
      .status(200)
      .json({ message: "Usuario ingresado exitosamente", token, userName });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserProfileController = async (req, res) => {
  const { userId } = req.user;

  try {
    const profile = await petMarketModel.getUserProfileModel(userId);

    return res.status(200).json({
      userName: profile.user_name,
      email: profile.email,
      idRegion: profile.id_region,
      idCommune: profile.id_commune,
      name: profile.name,
      firstSurname: profile.first_surname,
      secondSurname: profile.second_surname,
      street: profile.street,
      streetNumber: profile.street_number,
      phone: profile.phone,
      urlImgProfile: profile.url_img_profile,
    });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserProfileController = async (req, res) => {
  const { userId } = req.user;

  try {
    const {
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
    } = req.body;

    await petMarketModel.updateUserProfileModel({
      userId,
      userName,
      password: bcrypt.hashSync(password, 10),
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
    });

    const updatedUserProfile = await petMarketModel.getUserProfileModel(userId);

    return res.status(200).json({
      message: "Usuario modificado exitosamente",
      data: updatedUserProfile,
    });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const postCreatePostController = async (req, res) => {
  const { userId } = req.user;

  try {
    const {
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
    } = req.body;

    const newPost = await petMarketModel.postCreatePostModel({
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
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePostController = async (req, res) => {
  const { postId } = req.params;

  try {
    const {
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
    } = req.body;

    const updatedPost = await petMarketModel.updatePostModel({
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
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePostController = async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedPost = await petMarketModel.deletePostModel(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostController = async (req, res) => {
  try {
    const posts = await petMarketModel.getPostModel();

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostCategoryPetTypeController = async (req, res) => {
  const { petTypeId, categoryId } = req.params;

  try {
    const posts = await petMarketModel.getPostCategoryPetTypeModel({
      petTypeId,
      categoryId,
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const postAddPostFavoriteController = async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;

  try {
    const newPostFavorite = await petMarketModel.postAddPostFavoriteModel({
      userId,
      postId,
    });

    return res.status(201).json({
      favoriteId: newPostFavorite.id_favorite,
      postId: newPostFavorite.id_post,
    });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePostFavoriteController = async (req, res) => {
  const { favoriteId } = req.params;

  try {
    const deletedPostFavorite =
      await petMarketModel.deletePostFavoriteModel(favoriteId);

    if (!deletedPostFavorite) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserFavoriteController = async (req, res) => {
  const { userId } = req.user;

  try {
    const postsFavorite = await petMarketModel.getUserFavoriteModel(userId);

    return res.status(200).json(postsFavorite);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const petMarketController = {
  getRegionsController,
  getCommunesController,
  getPetTypeController,
  getCategoryController,
  postRegisterController,
  postLoginController,
  getUserProfileController,
  updateUserProfileController,
  postCreatePostController,
  updatePostController,
  deletePostController,
  getPostController,
  getPostCategoryPetTypeController,
  postAddPostFavoriteController,
  deletePostFavoriteController,
  getUserFavoriteController,
};
