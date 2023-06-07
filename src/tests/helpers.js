const { app } = require("..");
const supertest = require("supertest");

const api = supertest(app);

const initialGateways = [
  {
    serialNumber: "1234ABCD",
    name: "Gateway 1",
    ipAddress: "1.1.1.1",
    devices: [
      {
        uid: 1,
        vendor: "Gateway 1 Vendor",
        dateCreated: new Date(),
        status: "online",
      },
    ],
  },
  {
    serialNumber: "ABCD2020",
    name: "Gateway 2",
    ipAddress: "1.1.1.2",
    devices: [
      {
        uid: 2,
        vendor: "Gateway 2 Vendor",
        dateCreated: new Date(),
        status: "offline",
      },
    ],
  },
];

const getAllGateways = async () => {
  const response = await api.get("/gateways");
  return {
    contents: response.body.map((gateway) => gateway.content),
    response,
  };
};

module.exports = {
  api,
  initialGateways,
  getAllGateways,
};
