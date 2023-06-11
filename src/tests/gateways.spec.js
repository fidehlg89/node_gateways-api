const moongose = require("mongoose");

const { server } = require("..");
const Gateway = require("../models/Gateway");
const { api, initialGateways, getAllGateways } = require("./helpers");

beforeEach(async () => {
  await Gateway.deleteMany({});
  // sequential
  for (const gateway of initialGateways) {
    const gatewayObject = new Gateway(gateway);
    await gatewayObject.save();
  }
}, 10000); // Set the timeout to avoid errors within

describe("GET all Gateways", () => {
  test("gateways are returned as json", async () => {
    await api
      .get("/gateways")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("There are gateways", async () => {
    const response = await api.get("/gateways");
    expect(response.body).toHaveLength(initialGateways.length);
  });
});

describe("Create a Gateway", () => {
  test("is possible with a valid Gateway", async () => {
    const newGateway = {
      serialNumber: "New Gateway from test",
      name: "New Gateway Test",
      ipAddress: "1.10.1.1",
      devices: [
        {
          uid: 1111,
          vendor: "New Gateway vendor",
          dateCreated: new Date(),
          status: "online",
        },
      ],
    };

    await api
      .post("/gateways")
      .send(newGateway)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { contents, response } = await getAllGateways();

    expect(response.body).toHaveLength(initialGateways.length + 1);
    expect(contents).toContain(newGateway.content);
  });

  test("is not possible without required serialNumber", async () => {
    const newGateway = {
      name: "New Gateway Test 2",
      ipAddress: "1.10.1.2",
      devices: [
        {
          uid: 1111,
          vendor: "New Gateway vendor 2",
          dateCreated: new Date(),
          status: "online",
        },
      ],
    };

    await api.post("/gateways").send(newGateway).expect(400);

    const response = await api.get("/gateways");

    expect(response.body).toHaveLength(initialGateways.length);
  });

  test('return an error if the gateway has more than 10 devices', async () => {
    const gatewayData = {
      serialNumber: 'ABC12345',
      name: 'Gateway',
      ipAddress: '193.169.100.1',
      devices: [
        { uid: 1, vendor: 'Vendor 1', dateCreated: new Date(), status: 'online' },
        { uid: 2, vendor: 'Vendor 2', dateCreated: new Date(), status: 'online' },
        { uid: 3, vendor: 'Vendor 3', dateCreated: new Date(), status: 'online' },
        { uid: 4, vendor: 'Vendor 4', dateCreated: new Date(), status: 'online' },
        { uid: 5, vendor: 'Vendor 5', dateCreated: new Date(), status: 'online' },
        { uid: 6, vendor: 'Vendor 6', dateCreated: new Date(), status: 'online' },
        { uid: 7, vendor: 'Vendor 7', dateCreated: new Date(), status: 'online' },
        { uid: 8, vendor: 'Vendor 8', dateCreated: new Date(), status: 'online' },
        { uid: 9, vendor: 'Vendor 9', dateCreated: new Date(), status: 'online' },
        { uid: 10, vendor: 'Vendor 10', dateCreated: new Date(), status: 'online' },
        { uid: 11, vendor: 'Vendor 10', dateCreated: new Date(), status: 'online' },
      ],
    };

    const response = await api
      .post('/gateways') // Ruta para crear un nuevo gateway
      .send(gatewayData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('The gateway can have a maximum of 10 devices.');
  });
});

describe("Delete gateway", () => {
  test("delete a gateway", async () => {
    const { response: firstResponse } = await getAllGateways();
    const { body: gateways } = firstResponse;
    const gatewayToDelete = gateways[0];

    await api.delete(`/gateways/${gatewayToDelete._id}`);

    const { contents, response: secondResponse } = await getAllGateways();

    expect(secondResponse.body).toHaveLength(initialGateways.length - 1);
  });

  test("a gateway that has an invalid id can not be deleted", async () => {
    await api.delete("/gateways/1234").expect(500);

    const { response } = await getAllGateways();

    expect(response.body).toHaveLength(initialGateways.length);
  });

  test("a gateway that has a valid id but do not exist can not be deleted", async () => {
    const validObjectIdThatDoNotExist = "60451827152dc22ad768f442";
    await api.delete(`/gateways/${validObjectIdThatDoNotExist}`).expect(400);

    const { response } = await getAllGateways();

    expect(response.body).toHaveLength(initialGateways.length);
  });
});

describe("Update gateway", () => {
  test("Update an existing gateway", async () => {
    const { response: firstResponse } = await getAllGateways();
    const { body: gateways } = firstResponse;
    const gatewayToUpdate = gateways[0];

    const updatedGateway = {
      serialNumber: "Updated Gateway",
      name: "Updated Gateway Test",
      ipAddress: "1.20.1.1",
      devices: [
        {
          uid: 2222,
          vendor: "Updated Gateway Vendor",
          dateCreated: new Date(),
          status: "online",
        },
      ],
    };

    await api
      .put(`/gateways/${gatewayToUpdate._id}`)
      .send(updatedGateway)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const { response: secondResponse } = await getAllGateways();
    const { body: updatedGateways } = secondResponse;
    const updatedGatewaySerialNumbers = updatedGateways.map(
      (gateway) => gateway.serialNumber
    );

    expect(updatedGateways).toHaveLength(initialGateways.length);
    expect(updatedGatewaySerialNumbers).toContain(updatedGateway.serialNumber);
  });

  test("Update a gateway with an invalid ID", async () => {
    const invalidGatewayId = "1234";

    const updatedGateway = {
      serialNumber: "Updated Gateway",
      name: "Updated Gateway Test",
      ipAddress: "1.20.1.1",
      devices: [
        {
          uid: 2222,
          vendor: "Updated Gateway Vendor",
          dateCreated: new Date(),
          status: "online",
        },
      ],
    };

    await api
      .put(`/gateways/${invalidGatewayId}`)
      .send(updatedGateway)
      .expect(500);

    const { response } = await getAllGateways();

    expect(response.body).toHaveLength(initialGateways.length);
  });

  test("Try to update a non-existent gateway", async () => {
    const nonExistentGatewayId = "60451827152dc22ad768f442";

    const updatedGateway = {
      serialNumber: "Updated Gateway non-existent",
      name: "Updated Gateway Test",
      ipAddress: "1.20.1.1",
      devices: [
        {
          uid: 2222,
          vendor: "Updated Gateway Vendor",
          dateCreated: new Date(),
          status: "online",
        },
      ],
    };

    await api
      .put(`/gateways/${nonExistentGatewayId}`)
      .send(updatedGateway)
      .expect(404);

    const { response } = await getAllGateways();

    expect(response.body).toHaveLength(initialGateways.length);
  });
});

afterAll(() => {
  moongose.connection.close();
  server.close();
});
