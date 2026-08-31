const { expect } = require ('chai');
const { request } = require ('supertest');
const app = require ('../src/app.js');

describe('Orders API', () => {

  it('debería responder con una lista de pedidos', async () => {

    const response = await request(app).get('/api/orders')
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('status')
    expect(response.body.status).to.equal('success')
    expect(response.body).to.have.property('payload')
    expect(response.body.payload).to.be.an('array')
  })
})