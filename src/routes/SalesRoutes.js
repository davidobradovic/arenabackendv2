// src/routes/SalesRoutes.js
const express = require('express');
const SalesController = require('../controllers/SalesController');
const router = express.Router();
// Pretraga vozila po VIN-u (zadnjih 4-5 brojeva)
router.get('/vehicle/search/:vinPart', SalesController.searchVehicleByVin);

// Chat sa Ognjenom
router.post('/chat/create', SalesController.createChatWithOgnjen);
router.get('/chat/:vin', SalesController.getChatByVin);
router.post('/chat/:chatId/message', SalesController.sendMessage);

// Quick Actions
router.post('/vehicle/reserve', SalesController.reserveVehicle);
router.post('/vehicle/quick-action', SalesController.executeQuickAction);

module.exports = router; 