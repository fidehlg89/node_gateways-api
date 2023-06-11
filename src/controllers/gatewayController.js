const Gateway = require('../models/Gateway');

// Create a new gateway
const createGateway = async (req, res) => {
  try {
    // Create a new Gateway instance with the request body data
    const gateway = new Gateway(req.body);

    // Save the gateway to the database
    const result = await gateway.save();

    // Return the created gateway in the response with status code 201 (Created)
    res.status(201).json(result);
  } catch (err) {
    // Handle validation errors separately
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      // Handle other errors as internal server errors
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  }
};

// Get all gateways
const getAllGateways = async (req, res) => {
  try {
    // Find all gateways in the database and populate the 'devices' field
    const gateways = await Gateway.find().populate('devices');

    // Return the gateways in the response
    res.json(gateways);
  } catch (err) {
    // Handle errors as internal server errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single gateway by ID
const getGatewayById = async (req, res) => {
  try {
    // Find a gateway by the provided ID and populate the 'devices' field
    const gateway = await Gateway.findById(req.params.id).populate('devices');

    // If the gateway is not found, return a 404 error
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }

    // Return the gateway in the response
    res.json(gateway);
  } catch (err) {
    // Handle errors as internal server errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a gateway by ID
const updateGatewayById = async (req, res) => {
  try {
    // Find a gateway by the provided ID and update it with the request body data
    const gateway = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated gateway in the response
      runValidators: true, // Run the model validators on the updated data
    });

    // If the gateway is not found, return a 404 error
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }

    // Return the updated gateway in the response
    res.json(gateway);
  } catch (err) {
    // Handle validation errors separately
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      // Handle other errors as internal server errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Delete a gateway by ID
const deleteGatewayById = async (req, res) => {
  try {
    // Find a gateway by the provided ID and remove it from the database
    const gateway = await Gateway.findByIdAndRemove(req.params.id);

    // If the gateway is not found, return a 400 error
    if (!gateway) {
      return res.status(400).json({ error: 'Invalid Gateway ID' });
    }

    // Return a success message in the response
    res.json({ message: 'Gateway deleted successfully' });
  } catch (err) {
    // Handle errors as internal server errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createGateway,
  getAllGateways,
  getGatewayById,
  updateGatewayById,
  deleteGatewayById,
};
