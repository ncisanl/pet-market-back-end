import { request } from "supertest";
import { app } from "../index";

describe("POST /posts", () => {
    it("Debería crear un nuevo post", async () => {
        const response = await request(app)
            .post("/posts")
            .send({
                id_user: 1,
                id_product: 2,
                title: "Nuevo Post",
                simple_description: "Descripción corta",
                full_description: "Descripción completa",
                stock: 10,
                available: true,
            })
            .set("Authorization",);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id_post");
    });
});

describe("PUT /posts/:id_post", () => {
    it("Debería actualizar un post", async () => {
        const response = await request(app)
            .put("/posts/1")
            .send({
                title: "Post Actualizado",
                simple_description: "Descripción actualizada",
                full_description: "Descripción completa actualizada",
                stock: 20,
                available: false,
            })
            .set("Authorization",);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Post Actualizado");
    });
});

describe("DELETE /posts/:id_post", () => {
    it("Debería eliminar un post", async () => {
        const response = await request(app)
        .delete("/posts/1")
        .set("Authorization", );
        expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post eliminado correctamente");
    });
});