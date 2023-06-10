const Gateway = require('../models/Gateway');

// Create a new gateway
const createGateway = async (req, res) => {
  try {
    const gateway = new Gateway(req.body); // Create a new Gateway instance with the request body
    const result = await gateway.save(); // Save the gateway to the database
    res.status(201).json(result); // Return the saved gateway as JSON with a status of 201 (Created)
  } catch (err) {
    if (err.name === 'Validation Error') {
      res.status(400).json({ error: err.message }); // Return a JSON error message with a status of 400 (Bad Request) if there is a validation error
    } else {
      res.status(500).json({ error: 'Internal server error', message: err.message }); // Return a JSON error message with a status of 500 (Internal Server Error) for other errors
    }
  }
};

// Get all gateways
const getAllGateways = async (req, res) => {
  try {
    const gateways = await Gateway.find().populate('devices'); // Retrieve all gateways from the database and populate the 'devices' field
    res.json(gateways); // Return the gateways as JSON
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' }); // Return a JSON error message with a status of 500 (Internal Server Error) if there is an error
  }
};

// Get a single gateway by ID
const getGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findById(req.params.id).populate('devices'); // Find a gateway by ID and populate the 'devices' field
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' }); // Return a JSON error message with a status of 404 (Not Found) if the gateway is not found
    }
    res.json(gateway); // Return the gateway as JSON
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' }); // Return a JSON error message with a status of 500 (Internal Server Error) if there is an error
  }
};

// Update a gateway by ID
const updateGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); // Find a gateway by ID and update it with the request body, enabling the return of the updated gateway and running validators
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' }); // Return a JSON error message with a status of 404 (Not Found) if the gateway is not found
    }
    res.json(gateway); // Return the updated gateway as JSON
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message }); // Return a JSON error message with a status of 400 (Bad Request) if there is a validation error
    } else {
      res.status(500).json({ error: 'Internal server error' }); // Return a JSON error message with a status of 500 (Internal Server Error) for other errors
    }
  }
};

// Delete a gateway by ID
const deleteGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndRemove(req.params.id); // Find a gateway by ID and remove it from the database
    if (!gateway) {
      return res.status(400).json({ error: 'Invalid Gateway ID' }); // Return a JSON error message with a status of 400 (Bad Request) if the gateway is not found
    }
    res.json({ message: 'Gateway deleted successfully' }); // Return a JSON success message
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' }); // Return a JSON error message with a status of 500 (Internal Server Error) if there is an error
  }
};

module.exports = {
  createGateway,
  getAllGateways,
  getGatewayById,
  updateGatewayById,
  deleteGatewayById,
};
