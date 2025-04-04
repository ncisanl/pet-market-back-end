import { pool } from "../database/connection.js";
import format from "pg-format";

export const postModel = {
    async obtenerPosts() {
        const consulta = "SELECT * FROM posts";
        const result = await pool.query(consulta);
        return result.rows;
    },

    async agregarPost({ title, simple_description, full_description, stock, available }) {
        const query = format(
            "INSERT INTO posts (title, simple_description, full_description, stock, available, creation_date, update_date) VALUES (%L, %L, %L, %L, %L, NOW(), NOW()) RETURNING *", 
            title, 
            simple_description, 
            full_description, 
            stock, 
            available
        );
        const { rows } = await pool.query(query);
        return rows[0];
    },

    async actualizarPost(id_post, { title, simple_description, full_description, stock, available }) {
        const query = format(
            "UPDATE posts SET title = %L, simple_description = %L, full_description = %L, stock = %L, available = %L, update_date = NOW() WHERE id = %L RETURNING *",
            title, 
            simple_description, 
            full_description, 
            stock, 
            available, 
            id_post
        );
        const { rows } = await pool.query(query);
        return rows[0];
    },

    async eliminarPost(id_post) {
        const query = format("DELETE FROM posts WHERE id = %L RETURNING *", id_post);
        const { rows } = await pool.query(query);
        return rows[0];
    }
};
