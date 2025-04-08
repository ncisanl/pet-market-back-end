import { petMarketController } from "../controllers/petmarket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Obtener regiones
router.get("/regions", petMarketController.getRegionsController);

// Obtener comunas segun la region
router.get("/communes/:regionId", petMarketController.getCommunesController);

// Obtener tipo de mascota
router.get("/pet-type", petMarketController.getPetTypeController);

// Obtener categorias
router.get("/category", petMarketController.getCategoryController);

// Registrar usuario
router.post("/register", petMarketController.postRegisterController);

// Ingresar usuario
router.post("/login", petMarketController.postLoginController);

// Obtener perfil del usuario
router.get(
  "/user/profile",
  authMiddleware,
  petMarketController.getUserProfileController,
);

// Modificar datos del usuario
router.post(
  "/user/profile/update",
  authMiddleware,
  petMarketController.updateUserProfileController,
);

// Crear post
router.post(
  "/posts",
  authMiddleware,
  petMarketController.postCreatePostController,
);

// Modificar post
router.put(
  "/posts/:postId",
  authMiddleware,
  petMarketController.updatePostController,
);

// Eliminar post
router.delete(
  "/posts/:postId",
  authMiddleware,
  petMarketController.deletePostController,
);

// Obtener todos los post
router.get("/posts", authMiddleware, petMarketController.getPostController);

// Obtener post segun tipo de mascota y categoria
router.get(
  "/posts/pet-type/:petTypeId/category/:categoryId",
  authMiddleware,
  petMarketController.getPostCategoryPetTypeController,
);

// Agregar favorito
router.post(
  "/favorite",
  authMiddleware,
  petMarketController.postAddPostFavoriteController,
);

// Eliminar favorito
router.delete(
  "/favorite/:favoriteId",
  authMiddleware,
  petMarketController.deletePostFavoriteController,
);

// Obtener favoritos segun el usuario
router.get(
  "/user/favorite",
  authMiddleware,
  petMarketController.getUserFavoriteController,
);

// Crear carrito y agregar primer post
router.post(
  "/cart",
  authMiddleware,
  petMarketController.postCreateCartController,
);

// Agregar post a un carrito existente
router.post(
  "/cart/:cartId",
  authMiddleware,
  petMarketController.postAddPostCartController,
);

// Modificar la cantidad de un post agregado en el carrito
router.put(
  "/cart/:cartId/post/:postId/quantity/:quantity",
  authMiddleware,
  petMarketController.updatePostCartController,
);

// Eliminar un post del carrito
router.delete(
  "/cart/:cartId/post/:postId",
  authMiddleware,
  petMarketController.deletePostCartController,
);

// Eliminar un carrito
router.delete(
  "/cart/:cartId",
  authMiddleware,
  petMarketController.deleteCartController,
);

// Obtener post del carrito
router.get("/cart", authMiddleware, petMarketController.getCartPostController);

export default router;
