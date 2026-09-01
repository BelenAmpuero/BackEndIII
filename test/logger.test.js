const { expect } = require ('chai');
const request = require ('supertest');
const app = require ('../src/app.js');


describe('Logger API', () => {
  it('log INFO generado correctamente', async () => {
    const response = await request(app).get('/api/loggerTest/info')
    expect(response.status).to.equal(200)
    expect(response.body.status).to.equal('success')
    expect(response.body.message).to.equal('Log INFO generado correctamente')
  })
})