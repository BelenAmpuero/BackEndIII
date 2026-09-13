const { expect } = require("chai");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app.js");
const connectDB = require("../src/config/db");

const User = require("../src/models/user.model.js");
const DeliveryPerson = require("../src/models/deliveryPerson.model.js");


describe("DeliveryPerson API", () => {

    before(async () => {
        await connectDB();
    });


    beforeEach(async () => {
        await DeliveryPerson.deleteMany({});
        await User.deleteMany({});
    });


    after(async () => {
        await DeliveryPerson.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });


    // ==========================================
    // GET ALL DELIVERY PERSONS
    // ==========================================

    it("debería obtener todos los repartidores", async () => {

    const user = await User.create({
        name: "Usuario Test",
        email: "delivery@test.com",
        password: "123456"
    });

    await DeliveryPerson.create({
        user: user._id,
        vehicle: {
            kind: "moto",
            plate: "ABC123"
        }
    });

    const response = await request(app)
        .get("/api/deliveryPersons");

    expect(response.status).to.equal(200);

    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("success");

    expect(response.body).to.have.property("payload");
    expect(response.body.payload).to.be.an("object");

    expect(response.body.payload).to.have.property("data");
    expect(response.body.payload.data).to.be.an("array");

    expect(response.body.payload.data).to.have.lengthOf(1);

    expect(response.body.payload.data[0]).to.have.property("_id");
    expect(response.body.payload.data[0]).to.have.property("user");
    expect(response.body.payload.data[0]).to.have.property("vehicle");

    expect(response.body.payload).to.have.property("total");
    expect(response.body.payload.total).to.equal(1);

    expect(response.body.payload).to.have.property("page");
    expect(response.body.payload.page).to.equal(1);

    expect(response.body.payload).to.have.property("limit");
    expect(response.body.payload.limit).to.equal(10);

    expect(response.body.payload).to.have.property("totalPages");
    expect(response.body.payload.totalPages).to.equal(1);
});

    // ==========================================
    // GET DELIVERY PERSON BY ID
    // ==========================================

    it("debería obtener un repartidor por ID", async () => {

        const user = await User.create({
            name: "Usuario Test",
            email: "deliveryid@test.com",
            password: "123456"
        });

        const deliveryPerson = await DeliveryPerson.create({
            user: user._id,
            vehicle: {
                kind: "car",
                plate: "XYZ789"
            }
        });

        const response = await request(app)
            .get(`/api/deliveryPersons/${deliveryPerson._id}`);

        expect(response.status).to.equal(200);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");

        expect(response.body.payload).to.have.property("_id");

        expect(response.body.payload._id.toString())
            .to.equal(deliveryPerson._id.toString());

        expect(response.body.payload.vehicle.kind)
            .to.equal("car");
    });


    it("debería devolver 404 si el repartidor no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/deliveryPersons/${fakeId}`);

        expect(response.status).to.equal(404);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");
        expect(response.body.code)
            .to.equal("DELIVERY_PERSON_NOT_FOUND");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 400 si el ID del repartidor es inválido", async () => {

        const response = await request(app)
            .get("/api/deliveryPersons/id-invalido");

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_DELIVERY_PERSON");

        expect(response.body).to.have.property("message");
    });


    // ==========================================
    // CREATE DELIVERY PERSON
    // ==========================================

    it("debería crear un repartidor correctamente", async () => {

        const user = await User.create({
            name: "Nuevo Repartidor",
            email: "newdelivery@test.com",
            password: "123456"
        });

        const response = await request(app)
            .post("/api/deliveryPersons")
            .send({
                user: user._id.toString(),
                vehicle: {
                    kind: "bicycle",
                    plate: "BIKE123"
                },
                isAvailable: true,
                currentLocation: {
                    lat: -31.4167,
                    lng: -64.1833
                }
            });

        expect(response.status).to.equal(201);

        expect(response.body.status).to.equal("success");

        expect(response.body).to.have.property("payload");

        expect(response.body.payload).to.have.property("_id");

        expect(response.body.payload.user.toString())
            .to.equal(user._id.toString());

        expect(response.body.payload.vehicle.kind)
            .to.equal("bicycle");

        expect(response.body.payload.vehicle.plate)
            .to.equal("BIKE123");
    });


    it("debería devolver 400 si faltan datos obligatorios", async () => {

        const response = await request(app)
            .post("/api/deliveryPersons")
            .send({
                vehicle: {
                    kind: "moto"
                }
            });

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_DELIVERY_PERSON");

        expect(response.body).to.have.property("message");
    });


    it("debería devolver 400 si el usuario asociado no existe", async () => {

        const fakeUserId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post("/api/deliveryPersons")
            .send({
                user: fakeUserId.toString(),
                vehicle: {
                    kind: "moto",
                    plate: "MOTO123"
                }
            });

        expect(response.status).to.equal(400);

        expect(response.body.status).to.equal("error");

        expect(response.body).to.have.property("code");

        expect(response.body.code)
            .to.equal("INVALID_DELIVERY_PERSON");

        expect(response.body).to.have.property("message");
    });

    it("debería devolver 400 si el tipo de vehículo no es válido", async () => {

    const user = await User.create({
        name: "Usuario Vehiculo",
        email: "vehicle@test.com",
        password: "123456"
    });

    const response = await request(app)
        .post("/api/deliveryPersons")
        .send({
            user: user._id.toString(),
            vehicle: {
                kind: "truck",
                plate: "TRUCK123"
            }
        });

    expect(response.status).to.equal(400);

    expect(response.body.status).to.equal("error");

    expect(response.body).to.have.property("code");

    expect(response.body.code)
        .to.equal("INVALID_DELIVERY_PERSON");

    expect(response.body).to.have.property("message");
});
});
