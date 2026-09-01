const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");
const connectDB = require("../src/config/db");

const User = require("../src/models/user.model.js");
const Order = require("../src/models/order.models.js");

const { ORDER_STATUS } = require("../src/utils/constants");

describe("Orders API", () => {

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
  });

  after(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });


  // GET ALL ORDERS

  describe("GET /api/orders", () => {

    it("debería responder con una lista de pedidos", async () => {

      const response = await request(app)
        .get("/api/orders");

      expect(response.status).to.equal(200);

      expect(response.body).to.have.property("status");
      expect(response.body.status).to.equal("success");

      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
    });

  });


  // GET ORDER BY ID

  describe("GET /api/orders/:id", () => {

    it("debería obtener un pedido existente por ID", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "test-order@example.com",
        password: "123456"
      });

      const order = await Order.create({
        user: user._id,
        items: [
          {
            product: "Producto Test",
            quantity: 2,
            price: 100
          }
        ],
        total: 200,
        deliveryAddress: "Dirección Test"
      });

      const response = await request(app)
        .get(`/api/orders/${order._id}`);

      expect(response.status).to.equal(200);

      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");

      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload._id).to.equal(order._id.toString());

      expect(response.body.payload).to.have.property("user");
      expect(response.body.payload).to.have.property("items");
      expect(response.body.payload.items).to.be.an("array");
      expect(response.body.payload).to.have.property("total");
    });


    it("debería responder 404 si el pedido no existe", async () => {

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/orders/${fakeId}`);

      expect(response.status).to.equal(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("ORDER_NOT_FOUND");
      expect(response.body.message).to.equal("Pedido no encontrado");
    });


    it("debería responder 400 si el ID del pedido no es válido", async () => {

      const response = await request(app)
        .get("/api/orders/id-invalido");

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("INVALID_ORDER_DATA");
      expect(response.body.message).to.equal(
        "Los datos del pedido no son válidos"
      );
    });

  });


  // CREATE ORDER

  describe("POST /api/orders", () => {

    it("debería crear un pedido correctamente", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "create-order@example.com",
        password: "123456"
      });

      const orderData = {
        user: user._id.toString(),
        items: [
          {
            product: "Producto Test",
            quantity: 2,
            price: 150
          }
        ],
        deliveryAddress: "Av. Test 123"
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.status).to.equal(201);

      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");

      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload.user.toString()).to.equal(
        user._id.toString()
      );

      expect(response.body.payload.items).to.be.an("array");
      expect(response.body.payload.items).to.have.lengthOf(1);

      expect(response.body.payload.total).to.equal(300);
      expect(response.body.payload.deliveryAddress).to.equal(
        "Av. Test 123"
      );
    });


    it("debería responder 400 si faltan datos obligatorios", async () => {

      const response = await request(app)
        .post("/api/orders")
        .send({});

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
    });


    it("debería responder 400 si los items están vacíos", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "empty-items@example.com",
        password: "123456"
      });

      const response = await request(app)
        .post("/api/orders")
        .send({
          user: user._id.toString(),
          items: [],
          deliveryAddress: "Dirección Test"
        });

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
    });


    it("debería responder 400 si la cantidad de un producto no es válida", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "invalid-quantity@example.com",
        password: "123456"
      });

      const response = await request(app)
        .post("/api/orders")
        .send({
          user: user._id.toString(),
          items: [
            {
              product: "Producto Test",
              quantity: 0,
              price: 100
            }
          ],
          deliveryAddress: "Dirección Test"
        });

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
    });


    it("debería responder 400 si el usuario no existe", async () => {

      const fakeUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post("/api/orders")
        .send({
          user: fakeUserId.toString(),
          items: [
            {
              product: "Producto Test",
              quantity: 1,
              price: 100
            }
          ],
          deliveryAddress: "Dirección Test"
        });

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
    });

  });


  // UPDATE ORDER STATUS

  describe("PATCH /api/orders/:id/status", () => {

    it("debería actualizar el estado de un pedido", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "update-status@example.com",
        password: "123456"
      });

      const order = await Order.create({
        user: user._id,
        items: [
          {
            product: "Producto Test",
            quantity: 1,
            price: 100
          }
        ],
        total: 100,
        deliveryAddress: "Dirección Test"
      });

      const newStatus = Object.values(ORDER_STATUS)
        .find(status => status !== order.status);

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({
          status: newStatus
        });

      expect(response.status).to.equal(200);

      expect(response.body.status).to.equal("success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload.status).to.equal(newStatus);
    });


    it("debería responder 400 si el estado no es válido", async () => {

      const user = await User.create({
        name: "Usuario Test",
        email: "invalid-status@example.com",
        password: "123456"
      });

      const order = await Order.create({
        user: user._id,
        items: [
          {
            product: "Producto Test",
            quantity: 1,
            price: 100
          }
        ],
        total: 100,
        deliveryAddress: "Dirección Test"
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({
          status: "ESTADO_INEXISTENTE"
        });

      expect(response.status).to.equal(400);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("INVALID_ORDER_STATUS");
      expect(response.body.message).to.equal(
        "El estado del pedido no es válido"
      );
    });


    it("debería responder 404 si el pedido no existe", async () => {

      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/orders/${fakeId}/status`)
        .send({
          status: Object.values(ORDER_STATUS)[0]
        });

      expect(response.status).to.equal(404);

      expect(response.body.status).to.equal("error");
      expect(response.body.code).to.equal("ORDER_NOT_FOUND");
      expect(response.body.message).to.equal("Pedido no encontrado");
    });

  });

});
