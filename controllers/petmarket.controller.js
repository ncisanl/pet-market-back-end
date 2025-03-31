import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { petMarketModel } from "../models/petmarket.model.js";

const getRegionsController = async (req, res) => {
  try {
    const regiones = await petMarketModel.getRegionsModel();

    return res.status(200).json(regiones);
  } catch (error) {
    console.log(error);
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
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const petMarketController = {
  getRegionsController,
  getCommunesController,
};
