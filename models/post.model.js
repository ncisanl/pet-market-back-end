import format from "pg-format";
import { Pool } from "pg";

export const postModel = {
    async createPost({id_user, id_product, title, simple_description, full_description, stock, available }) {
        const query = format ("INSERT INTO post (id_user, id_product, title, simple_description, full_description, stock, available, creation_date, update_date) VALUES (%L, %L, %L, %L, %L, %L, %L, NOW(), NOW()) RETURNING *",id_user, id_product, title, simple_description, full_description, stock, available);
        const { rows } = await pool.query(query);
        return rows[0];
    },

    async updatePost(id_post, { title, simple_description, full_description, stock, available }) {
        const query = format("UPDATE post SET title = %L, simple_description = %L, full_description = %L, stock = %L, available = %L, update_date = NOW() WHERE id_post = %L RETURNING *",
            title, simple_description, full_description, stock, available, id_post);
            const { rows } = await pool.query(query);
            return rows[0];
    },

    async deletePost(id_post) {
        const query = format("DELETE FROM post WHERE id_post = %L RETURNING *", id_post);
        const { rows } = await pool.query(query);
        return rows[0];
    }
};