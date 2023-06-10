const { Schema, model } = require("mongoose");

const gatewaySchema = new Schema({
  serialNumber: { type: String, required: true, unique: true }, // Serial number of the gateway (required and unique)
  name: { type: String, required: true }, // Name of the gateway (required)
  ipAddress: { // IP address of the gateway (required and validated using a regular expression)
    type: String,
    required: true,
    match: /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/,
  },
  devices: { // Array of devices associated with the gateway
    type: [
      {
        uid: { type: Number, required: true }, // Unique identifier of the device (required)
        vendor: { type: String, required: true }, // Vendor of the device (required)
        dateCreated: { type: Date, required: true, default: Date.now }, // Date of device creation (required and default set to current date)
        status: { type: String, enum: ["online", "offline"], required: true }, // Status of the device (required and must be either "online" or "offline")
      },
    ],
    validate: { // Custom validator to check the number of devices (must be less than or equal to 10)
      validator: function (devices) {
        return devices.length <= 10;
      },
      message: "The gateway must have a minimum of 10 devices.",
    },
    required: true, // The devices array is required for a gateway
  },
});

const Gateway = model("Gateway", gatewaySchema); // Create the Gateway model based on the gatewaySchema

module.exports = Gateway;
