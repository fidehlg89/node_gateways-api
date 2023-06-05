const express = require('express');
const Gateway = require('../models/Gateway');

const router = express.Router();

// Create a new gateway
router.post('/', async (req, res) => {
  //console.log("🚀 ~ file: gateways.js:8 ~ router.post ~ req:", req.body)
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
});

// Get all gateways
router.get('/', async (req, res) => {
  try {
    const gateways = await Gateway.find().populate('devices');
    res.json(gateways);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single gateway by ID
router.get('/:id', async (req, res) => {
  try {
    const gateway = await Gateway.findById(req.params.id).populate('devices');
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a gateway by ID
router.put('/:id', async (req, res) => {
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
});

// Delete a gateway by ID
router.delete('/:id', async (req, res) => {
  try {
    const gateway = await Gateway.findByIdAndRemove(req.params.id);
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json({ message: 'Gateway deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
