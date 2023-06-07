const moongose = require("mongoose");

const { server } = require("..");
const Gateway = require("../models/Gateway");
const { api, initialGateways, getAllGateways } = require("./helpers");
const { response } = require("express");

beforeEach(async () => {
  await Gateway.deleteMany({});
  // sequential
  for (const gateway of initialGateways) {
    const gatewayObject = new Gateway(gateway);
    await gatewayObject.save();
  }
}, 10000); // Set the timeout to 10000 ms (10 seconds) to avoid errors within

describe('GET all Gateways', () => {
  test('gateways are returned as json', async () => {
    await api
      .get('/gateways')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
});

afterAll(() => {
  moongose.connection.close();
  server.close();
});
