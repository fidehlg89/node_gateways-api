const { Schema, model } = require("mongoose");

const gatewaySchema = new Schema({
  serialNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ipAddress: {
    type: String,
    required: true,
    match:
      /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/,
  },
  devices: [
    {
      uid: { type: Number, required: true },
      vendor: { type: String, required: true },
      dateCreated: { type: Date, required: true, default: Date.now },
      status: { type: String, enum: ["online", "offline"], required: true },
    },
  ],
});

const Gateway = model("Gateway", gatewaySchema);

module.exports = Gateway;
