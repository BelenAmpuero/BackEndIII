const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");
const connectDB = require("../src/config/db");

const User = require("../src/models/user.model.js");
const Order = require("../src/models/order.models.js");
const DeliveryPerson = require("../src/models/deliveryPerson.model.js");
const Delivery = require("../src/models/delivery.model.js");

const {
    DELIVERY_STATUS,
    ORDER_STATUS,
    ORDER_PRIORITY
} = require("../src/utils/constants");


describe("Deliveries API", () => {

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
    // GET ALL DELIVERIES
    // ==========================================

    it("debería obtener todas las entregas", async () => {

        const user = await User.create({
            name: "Usuario Delivery",
            email: "deliverylist@test.com",
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
            deliveryAddress: "Calle Test 123",
            status: ORDER_STATUS.PENDING,
            priority: ORDER_PRIORITY.LOW
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "ABC123"
            }
        });

        await Delivery.create({
            order: order._id,
            deliveryPerson: deliveryPerson._id
        });

        const response = await request(app)
            .get("/api/deliveries");

        expect(response.status).to.equal(200);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");

        expect(response.body.payload).to.have.lengthOf(1);

        expect(response.body.payload[0]).to.have.property("_id");
        expect(response.body.payload[0]).to.have.property("order");
        expect(response.body.payload[0]).to.have.property("deliveryPerson");
        expect(response.body.payload[0]).to.have.property("status");
    });


    // ==========================================
    // GET DELIVERY BY ID
    // ==========================================

    it("debería obtener una entrega por ID", async () => {

        const user = await User.create({
            name: "Usuario Get Delivery",
            email: "getdelivery@test.com",
            password: "123456"
        });

        const order = await Order.create({
            user: user._id,
            items: [
                {
                    product: "Producto Test",
                    quantity: 1,
                    price: 500
                }
            ],
            total: 500,
            deliveryAddress: "Calle Test 456"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "car",
                plate: "XYZ789"
            }
        });

        const delivery = await Delivery.create({
            order: order._id,
            deliveryPerson: deliveryPerson._id
        });

        const response = await request(app)
            .get(`/api/deliveries/${delivery._id}`);

        expect(response.status).to.equal(200);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");

        expect(response.body.payload)
            .to.have.property("_id");

        expect(response.body.payload._id.toString())
            .to.equal(delivery._id.toString());
    });


    it("debería devolver 404 si la entrega no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/deliveries/${fakeId}`);

        expect(response.status).to.equal(404);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("DELIVERY_NOT_FOUND");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 400 si el ID de la entrega es inválido", async () => {

        const response = await request(app)
            .get("/api/deliveries/id-invalido");

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_DELIVERY_DATA");

        expect(response.body).to.have.property("message");
    });


    // ==========================================
    // CREATE DELIVERY
    // ==========================================

    it("debería crear una entrega correctamente", async () => {

        const user = await User.create({
            name: "Usuario Create Delivery",
            email: "createdelivery@test.com",
            password: "123456"
        });

        const order = await Order.create({
            user: user._id,
            items: [
                {
                    product: "Producto Test",
                    quantity: 2,
                    price: 150
                }
            ],
            total: 300,
            deliveryAddress: "Calle Create 123"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "DEL123"
            },
            isAvailable: true
        });

        const response = await request(app)
            .post("/api/deliveries")
            .send({
                order: order._id.toString(),
                deliveryPerson: deliveryPerson._id.toString()
            });

        expect(response.status).to.equal(201);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");

        expect(response.body.payload)
            .to.have.property("_id");

        expect(response.body.payload.order.toString())
            .to.equal(order._id.toString());

        expect(response.body.payload.deliveryPerson.toString())
            .to.equal(deliveryPerson._id.toString());

        expect(response.body.payload.status)
            .to.equal(DELIVERY_STATUS.ASSIGNED);
    });


    it("debería devolver 400 si faltan order o deliveryPerson", async () => {

        const response = await request(app)
            .post("/api/deliveries")
            .send({});

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("DELIVERY_ASSIGNMENT_FAILED");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 400 si el pedido no existe", async () => {

        const user = await User.create({
            name: "Usuario Order Inexistente",
            email: "order404@test.com",
            password: "123456"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "ORD404"
            }
        });

        const fakeOrderId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post("/api/deliveries")
            .send({
                order: fakeOrderId.toString(),
                deliveryPerson: deliveryPerson._id.toString()
            });

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body.code)
            .to.equal("DELIVERY_ASSIGNMENT_FAILED");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 404 si el repartidor no existe", async () => {

        const user = await User.create({
            name: "Usuario Person Inexistente",
            email: "person404@test.com",
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
            deliveryAddress: "Calle Test 789"
        });

        const fakeDeliveryPersonId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post("/api/deliveries")
            .send({
                order: order._id.toString(),
                deliveryPerson: fakeDeliveryPersonId.toString()
            });

        expect(response.status).to.equal(404);

        expect(response.body.status).to.equal("error");

        expect(response.body.code)
            .to.equal("DELIVERY_PERSON_NOT_FOUND");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 409 si el repartidor no está disponible", async () => {

        const user = await User.create({
            name: "Usuario No Disponible",
            email: "unavailable@test.com",
            password: "123456"
        });

        const order = await Order.create({
            user: user._id,
            items: [
                {
                    product: "Producto Test",
                    quantity: 1,
                    price: 200
                }
            ],
            total: 200,
            deliveryAddress: "Calle Test 999"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "NOAVAIL"
            },
            isAvailable: false
        });

        const response = await request(app)
            .post("/api/deliveries")
            .send({
                order: order._id.toString(),
                deliveryPerson: deliveryPerson._id.toString()
            });

        expect(response.status).to.equal(409);

        expect(response.body.status).to.equal("error");

        expect(response.body.code)
            .to.equal("DELIVERY_PERSON_NOT_AVAILABLE");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 400 si el estado de la entrega no es válido", async () => {

        const user = await User.create({
            name: "Usuario Invalid Status",
            email: "invalidstatus@test.com",
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
            deliveryAddress: "Calle Status 123"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "STATUS1"
            }
        });

        const response = await request(app)
            .post("/api/deliveries")
            .send({
                order: order._id.toString(),
                deliveryPerson: deliveryPerson._id.toString(),
                status: "invalid-status"
            });

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body.code)
            .to.equal("INVALID_DELIVERY_STATUS");

        expect(response.body).to.have.property("message");
    });


    // ==========================================
    // UPDATE DELIVERY STATUS
    // ==========================================

    it("debería actualizar el estado de una entrega", async () => {

        const user = await User.create({
            name: "Usuario Update Delivery",
            email: "updatedelivery@test.com",
            password: "123456"
        });

        const order = await Order.create({
            user: user._id,
            items: [
                {
                    product: "Producto Test",
                    quantity: 1,
                    price: 300
                }
            ],
            total: 300,
            deliveryAddress: "Calle Update 123"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "car",
                plate: "UPDATE1"
            }
        });

        const delivery = await Delivery.create({
            order: order._id,
            deliveryPerson: deliveryPerson._id,
            status: DELIVERY_STATUS.ASSIGNED
        });

        const response = await request(app)
            .patch(`/api/deliveries/${delivery._id}/status`)
            .send({
                status: DELIVERY_STATUS.COMPLETED
            });

        expect(response.status).to.equal(200);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");

        expect(response.body.payload.status)
            .to.equal(DELIVERY_STATUS.COMPLETED);

        expect(response.body.payload)
            .to.have.property("deliveredAt");

        expect(response.body.payload.deliveredAt)
            .to.not.equal(null);
    });


    it("debería devolver 409 si se intenta actualizar una entrega ya completada", async () => {

        const user = await User.create({
            name: "Usuario Completed",
            email: "completed@test.com",
            password: "123456"
        });

        const order = await Order.create({
            user: user._id,
            items: [
                {
                    product: "Producto Test",
                    quantity: 1,
                    price: 400
                }
            ],
            total: 400,
            deliveryAddress: "Calle Completed 456"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "moto",
                plate: "COMPLETE1"
            }
        });

        const delivery = await Delivery.create({
            order: order._id,
            deliveryPerson: deliveryPerson._id,
            status: DELIVERY_STATUS.COMPLETED,
            deliveredAt: new Date()
        });

        const response = await request(app)
            .patch(`/api/deliveries/${delivery._id}/status`)
            .send({
                status: DELIVERY_STATUS.ASSIGNED
            });

        expect(response.status).to.equal(409);

        expect(response.body.status).to.equal("error");

        expect(response.body.code)
            .to.equal("DELIVERY_ALREADY_COMPLETED");

        expect(response.body).to.have.property("message");
    });

});