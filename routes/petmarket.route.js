import { petMarketController } from "../controllers/petmarket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/regions", petMarketController.getRegionsController);

router.get("/communes/:regionId", petMarketController.getCommunesController);

router.post("/register", petMarketController.postRegisterController);

router.post("/login", petMarketController.postLoginController);

router.get(
  "/user/profile",
  authMiddleware,
  petMarketController.getUserProfileController,
);

export default router;
