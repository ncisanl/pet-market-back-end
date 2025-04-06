import { petMarketController } from "../controllers/petmarket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/regions", petMarketController.getRegionsController);

router.get("/communes/:regionId", petMarketController.getCommunesController);

router.get("/pet-type", petMarketController.getPetTypeController);

router.get("/category", petMarketController.getCategoryController);

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
  "/posts",
  authMiddleware,
  petMarketController.postCreatePostController,
);

router.put(
  "/posts/:postId",
  authMiddleware,
  petMarketController.updatePostController,
);

router.delete(
  "/posts/:postId",
  authMiddleware,
  petMarketController.deletePostController,
);

router.get("/posts", authMiddleware, petMarketController.getPostController);

router.get(
  "/posts/pet-type/:petTypeId/category/:categoryId",
  authMiddleware,
  petMarketController.getPostCategoryPetTypeController,
);

router.post(
  "/posts/:postId/favorite",
  authMiddleware,
  petMarketController.postAddPostFavoriteController,
);

router.delete(
  "/posts/favorite/:favoriteId",
  authMiddleware,
  petMarketController.deletePostFavoriteController,
);

router.get(
  "/user/favorite",
  authMiddleware,
  petMarketController.getUserFavoriteController,
);

export default router;
