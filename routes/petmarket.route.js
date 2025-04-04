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

router.post(
  "/user/profile/update",
  authMiddleware,
  petMarketController.updateUserProfileController,
);

router.post(
  "/posts/",
  authMiddleware,
  petMarketController.postCreatePostController,
);
router.put(
  "/posts/:id_post",
  authMiddleware,
  petMarketController.updatePostController,
);
router.delete(
  "/posts/:id_post",
  authMiddleware,
  petMarketController.deletePostController,
);

export default router;
