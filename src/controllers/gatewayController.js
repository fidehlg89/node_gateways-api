const Gateway = require('../models/Gateway');

// Create a new gateway
const createGateway = async (req, res) => {
  try {
    const gateway = new Gateway(req.body);
    const result = await gateway.save();
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  }
};

// Get all gateways
const getAllGateways = async (req, res) => {
  try {
    const gateways = await Gateway.find().populate('devices');
    res.json(gateways);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single gateway by ID
const getGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findById(req.params.id).populate('devices');
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a gateway by ID
const updateGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Delete a gateway by ID
const deleteGatewayById = async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndRemove(req.params.id);
    if (!gateway) {
      return res.status(400).json({ error: 'Invalid Gateway ID' });
    }
    res.json({ message: 'Gateway deleted successfully' });
  } catch (err) {
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
