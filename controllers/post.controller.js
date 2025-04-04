import { postModel } from "../models/post.model.js";

export const postController = {
    async getPosts(req, res) {
        try {
            const posts = await postModel.obtenerPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createPost(req, res) {
        try {
            const newPost = await postModel.agregarPost(req.body);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updatePost(req, res){
        try {
            const { id_post } = req.params;
            const updatedPost = await postModel.actualizarPost(id_post, req.body);
            if (!updatedPost) return res.status(404).json({ message: "Post no encontrado" });
            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deletePost(req, res) {
        try {
            const { id_post } = req.params;
            const deletedPost = await postModel.eliminarPost(id_post);
            if (!deletedPost) return res.status(404).json({ message: "Post no encontrado" });
            res.json({ message: "Post eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

