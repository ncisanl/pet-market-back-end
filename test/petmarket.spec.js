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

decribe("POST - /register", () => {
  // it("status code 201 al registrar exitosamente un nuevo usuario", async () => {
  //   const bodyTest = {
  //     userName: "nicole",
  //     password: "123",
  //     email: "pruebatest@gmail.com",
  //     idRegion: 1,
  //     idCommune: 2,
  //     name: "Nicole",
  //     firstSurname: "Hurtado",
  //     secondSurname: "Lopez",
  //     street: "Las Calilas",
  //     streetNumber: 146,
  //     phone: "+56914460942",
  //     urlImgProfile:
  //       "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png",
  //   };
  //   const response = await request(app)
  //     .post("/pet-market/register")
  //     .send(bodyTest);
  //   expect(response.statusCode).toBe(201);
  // });

  it("status code 409 al intentar registrar un usuario ya existente", async () => {
    const bodyTest = {
      userName: "nico",
      password: "123",
      email: "prueba@gmail.com",
      idRegion: 1,
      idCommune: 3,
      name: "Nicolás",
      firstSurname: "San Martín",
      secondSurname: "Lorca",
      street: "Las Rosas",
      streetNumber: 146,
      phone: "+56914460942",
      urlImgProfile:
        "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png",
    };
    const response = await request(app)
      .post("/pet-market/register")
      .send(bodyTest);
    expect(response.statusCode).toBe(409);
  });
});

describe("POST - /login", () => {
  it("status code 200 al ingresar exitosamente", async () => {
    const bodyTest = {
      userName: "nico",
      password: "123",
    };
    const response = await request(app)
      .post("/pet-market/login")
      .send(bodyTest);
    expect(response.statusCode).toBe(200);
  });

  it("status code 400 al ingresar usuario o contraseña incorecta", async () => {
    const bodyTest = {
      userName: "nico",
      password: "1234",
    };
    const response = await request(app)
      .post("/pet-market/login")
      .send(bodyTest);
    expect(response.statusCode).toBe(400);
  });
});
