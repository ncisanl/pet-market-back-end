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

describe("POST - /register", () => {
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

describe("GET - /user/profile", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im5pY28iLCJ1c2VySWQiOjEsImlhdCI6MTc0MzcwNzcyOX0.I3MypCh7NaJWQBTwZlu723pl2CU2QMHeslEXuGhz7_E";

  it("status code 200 al obtener exitosamente los datos de un usuario", async () => {
    const response = await request(app)
      .get("/pet-market/user/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe("POST - /user/profile/update", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im5pY28iLCJ1c2VySWQiOjEsImlhdCI6MTc0MzcwNzcyOX0.I3MypCh7NaJWQBTwZlu723pl2CU2QMHeslEXuGhz7_E";

  it("status code 200 al modificar un usuario exitosamente", async () => {
    const bodyTest = {
      userName: "nico",
      password: "123",
      email: "prueba_modificacion_test@gmail.com",
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
      .post("/user/profile/update")
      .set("Authorization", `Bearer ${token}`)
      .send(bodyTest);
    expect(response.statusCode).toBe(200);
  });
});
