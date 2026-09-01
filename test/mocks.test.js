const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");
const connectDB = require("../src/config/db");

const User = require("../src/models/user.model.js");
const Order = require("../src/models/order.models.js");
const DeliveryPerson = require("../src/models/deliveryPerson.model.js");
const Delivery = require("../src/models/delivery.model.js");


describe("Mocks API", () => {

    before(async () => {
        await connectDB();
    });


    beforeEach(async () => {
        await Delivery.deleteMany({});
        await DeliveryPerson.deleteMany({});
        await Order.deleteMany({});
        await User.deleteMany({});
    });


    after(async () => {
        await Delivery.deleteMany({});
        await DeliveryPerson.deleteMany({});
        await Order.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });


    // ==========================================
    // MOCKING USERS
    // ==========================================

    it("debería generar usuarios mock correctamente", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingusers?qty=3");

        expect(response.status).to.equal(200);

        expect(response.body.status)
            .to.equal("success");

        expect(response.body)
            .to.have.property("payload");

        expect(response.body.payload)
            .to.be.an("array");

        expect(response.body.payload)
            .to.have.lengthOf(3);

        expect(response.body.payload[0])
            .to.have.property("_id");

        expect(response.body.payload[0])
            .to.have.property("name");

        expect(response.body.payload[0])
            .to.have.property("email");

        expect(response.body.payload[0])
            .to.have.property("password");
    });


    it("debería generar un usuario mock por defecto", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingusers");

        expect(response.status).to.equal(200);

        expect(response.body.status)
            .to.equal("success");

        expect(response.body.payload)
            .to.be.an("array");

        expect(response.body.payload)
            .to.have.lengthOf(1);
    });


    it("debería devolver 400 si la cantidad de usuarios mock es inválida", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingusers?qty=0");

        expect(response.status).to.equal(400);

        expect(response.body.status)
            .to.equal("error");

        expect(response.body)
            .to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_MOCK_QUANTITY");

        expect(response.body)
            .to.have.property("message");
    });


    // ==========================================
    // MOCKING ORDERS
    // ==========================================

    it("debería generar pedidos mock correctamente", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingorders?qty=3");

        expect(response.status).to.equal(200);

        expect(response.body.status)
            .to.equal("success");

        expect(response.body)
            .to.have.property("payload");

        expect(response.body.payload)
            .to.be.an("array");

        expect(response.body.payload)
            .to.have.lengthOf(3);

        expect(response.body.payload[0])
            .to.have.property("_id");

        expect(response.body.payload[0])
            .to.have.property("user");

        expect(response.body.payload[0])
            .to.have.property("items");

        expect(response.body.payload[0])
            .to.have.property("total");
    });


    it("debería generar cinco pedidos mock por defecto", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingorders");

        expect(response.status).to.equal(200);

        expect(response.body.status)
            .to.equal("success");

        expect(response.body.payload)
            .to.be.an("array");

        expect(response.body.payload)
            .to.have.lengthOf(5);
    });


    it("debería devolver 400 si la cantidad de pedidos mock es inválida", async () => {

        const response = await request(app)
            .get("/api/mocks/mockingorders?qty=-2");

        expect(response.status).to.equal(400);

        expect(response.body.status)
            .to.equal("error");

        expect(response.body)
            .to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_MOCK_QUANTITY");

        expect(response.body)
            .to.have.property("message");
    });


    // ==========================================
    // GENERATE DATA
    // ==========================================

    it("debería generar y guardar datos de prueba correctamente", async () => {

        const response = await request(app)
            .post("/api/mocks/generatedata?qty=2");

        expect(response.status).to.equal(201);

        expect(response.body.status)
            .to.equal("success");

        expect(response.body.message)
            .to.equal("Datos de prueba generados correctamente");

        expect(response.body)
            .to.have.property("inserted");

        expect(response.body.inserted)
            .to.be.an("object");

        expect(response.body.inserted.users)
            .to.equal(2);

        expect(response.body.inserted.orders)
            .to.equal(2);

        expect(response.body.inserted.deliveryPersons)
            .to.equal(2);

        expect(response.body.inserted.deliveries)
            .to.equal(2);
    });


    it("debería guardar en la base de datos la cantidad de datos generados", async () => {

        await request(app)
            .post("/api/mocks/generatedata?qty=3");

        const users = await User.countDocuments();
        const orders = await Order.countDocuments();
        const deliveryPersons = await DeliveryPerson.countDocuments();
        const deliveries = await Delivery.countDocuments();

        expect(users).to.equal(3);
        expect(orders).to.equal(3);
        expect(deliveryPersons).to.equal(3);
        expect(deliveries).to.equal(3);
    });


    it("debería devolver 400 si la cantidad para generatedata es inválida", async () => {

        const response = await request(app)
            .post("/api/mocks/generatedata?qty=0");

        expect(response.status).to.equal(400);

        expect(response.body.status)
            .to.equal("error");

        expect(response.body)
            .to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_MOCK_QUANTITY");

        expect(response.body)
            .to.have.property("message");
    });


    it("debería devolver 400 si la cantidad para generatedata no es un entero", async () => {

        const response = await request(app)
            .post("/api/mocks/generatedata?qty=2.5");

        expect(response.status).to.equal(400);

        expect(response.body.status)
            .to.equal("error");

        expect(response.body.code)
            .to.equal("INVALID_MOCK_QUANTITY");

        expect(response.body)
            .to.have.property("message");
    });

});