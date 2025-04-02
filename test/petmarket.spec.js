import request from "supertest";
import { app } from "../index";

describe("GET - /regions", () => {
  it("status code 200", async () => {
    const response = await request(app).get("/pet-market/regions");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET - /communes/:regionId", () => {
  it("status code 200", async () => {
    const response = await request(app).get("/pet-market/communes/1");
    expect(response.statusCode).toBe(200);
  });

  it("status code 400 and message invalid params value", async () => {
    const response = await request(app).get("/pet-market/communes/a");
    expect(response.statusCode).toBe(400);
  });
});
