const express = require('express');
const gatewayController = require('../controllers/gatewayController');

const router = express.Router();

// Create a new gateway
router.post('/', gatewayController.createGateway);

// Get all gateways
router.get('/', gatewayController.getAllGateways);

// Get a single gateway by ID
router.get('/:id', gatewayController.getGatewayById);

// Update a gateway by ID
router.put('/:id', gatewayController.updateGatewayById);

// Delete a gateway by ID
router.delete('/:id', gatewayController.deleteGatewayById);

module.exports = router;
