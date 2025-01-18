const express = require('express');
const router = express.Router();
const CreateOrderController = require("../controllers/Order/CreateOrderController");

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const createOrderController = new CreateOrderController(redisClientService);

    router.get('/:userId', [], (...args) => createOrderController.createOrder(...args));

    return router;
};
