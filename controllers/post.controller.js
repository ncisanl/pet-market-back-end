import { postModel } from "../models/post.model";

export const postController = {
    async createPost(req, res) {
        try {
            const newPost = await postModel.createPost(req.body);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updatePost(req, res) {
        try {
            const { id_post } = req.params;
            const updatedPost = await postModel.updatePost(id_post, req.body);
            if (!updatedPost) return res.status(404).json({ message: "Post no encontrado" });
            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deletePost(req, res) {
        try {
            const { id_post } = req.params;
            const deletedPost = await postModel.deletePost(id_post);
            if (!deletedPost) return res.status(404).json({ message: "Post no encontrado" });
            res.json({ message: "Post eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};