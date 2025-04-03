import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { authGuard } from "../middlewares/authGuard.js";

const router = Router();

router.post("/", authGuard, postController.createPost);
router.put("/:id_post", authGuard, postController.updatePost);
router.delete("/:id_post", authGuard, postController.deletePost);

export default router;