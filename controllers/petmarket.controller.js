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

  //TODO: Continuar con el update profile, donde se tiene que comparar en la BBDD el uderId e ingresar el resto de datos

  try {
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
  try {
    const newPost = await petMarketModel.postCreatePostModel(req.body);

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
  const { id_post } = req.params;

  try {
    const updatedPost = await petMarketModel.updatePostModel(id_post, req.body);

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
  const { id_post } = req.params;

  try {
    const deletedPost = await petMarketModel.deletePostModel(id_post);

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

export const petMarketController = {
  getRegionsController,
  getCommunesController,
  postRegisterController,
  postLoginController,
  getUserProfileController,
  updateUserProfileController,
  postCreatePostController,
  updatePostController,
  deletePostController,
};
