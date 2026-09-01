const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");
const connectDB = require("../src/config/db");

const User = require("../src/models/user.model.js");

describe("Users API", () => {

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });


  // GET ALL USERS

  describe("GET /api/users", () => {

    it("debería responder con una lista de usuarios", async () => {

      const response = await request(app)
        .get("/api/users");

      expect(response.status).to.equal(200);

      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal("success");

      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
    });

  });


  // GET USER BY ID

  describe("GET /api/users/:id", () => {

    it("debería obtener un usuario existente por ID", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "get-user@example.com",
        password: "123456"
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`);

      expect(response.status).to.equal(200);

      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");

      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload._id).to.equal(
        user._id.toString()
      );

      expect(response.body.payload.name).to.equal("Usuario Test");
      expect(response.body.payload.email).to.equal(
        "get-user@example.com"
      );
    });


    it("debería responder 404 si el usuario no existe", async () => {

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/users/${fakeId}`);

      expect(response.status).to.equal(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("USER_NOT_FOUND");
      expect(response.body.message).to.equal(
        "Usuario no encontrado"
      );
    });


    it("debería responder 400 si el ID del usuario no es válido", async () => {

      const response = await request(app)
        .get("/api/users/id-invalido");

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("INVALID_USER_DATA");
      expect(response.body.message).to.equal(
        "Los datos del usuario no son válidos"
      );
    });

  });


  // CREATE USER

  describe("POST /api/users", () => {

    it("debería crear un usuario correctamente", async () => {

      const userData = {
        name: "Nuevo Usuario",
        email: "new-user@example.com",
        password: "123456",
        phone: "3511234567",
        address: "Dirección Test"
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData);

      expect(response.status).to.equal(201);

      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");

      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload.name).to.equal("Nuevo Usuario");
      expect(response.body.payload.email).to.equal(
        "new-user@example.com"
      );

      expect(response.body.payload).to.have.property("password");

      expect(response.body.payload.password).to.not.equal(
        "123456"
      );
    });


    it("debería responder 400 si faltan datos obligatorios", async () => {

      const response = await request(app)
        .post("/api/users")
        .send({});

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("INVALID_USER_DATA");
      expect(response.body.message).to.equal(
        "Los datos del usuario no son válidos"
      );
    });


    it("debería responder 400 si falta el email", async () => {

      const response = await request(app)
        .post("/api/users")
        .send({
          name: "Usuario Test",
          password: "123456"
        });

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("INVALID_USER_DATA");
    });


    it("debería responder 409 si el email ya existe", async () => {

      await User.create({
        name: "Usuario Existente",
        email: "existing@example.com",
        password: "123456"
      });

      const response = await request(app)
        .post("/api/users")
        .send({
          name: "Otro Usuario",
          email: "existing@example.com",
          password: "abcdef"
        });

      expect(response.status).to.equal(409);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal(
        "USER_ALREADY_EXISTS"
      );
      expect(response.body.message).to.equal(
        "El usuario ya existe"
      );
    });

  });

});