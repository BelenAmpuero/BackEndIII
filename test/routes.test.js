const { expect } = require ('chai');
const request = require ('supertest');
const app = require ('../src/app.js');


describe('Not found routes', () => {
  it('debería responder 404 para una ruta inexistente', async () => {
    const response = await request(app).get('/api/route-that-does-not-exist')
    expect(response.status).to.equal(404)
    expect(response.body.status).to.equal('error')
    expect(response.body).to.have.property('message')
  })
})