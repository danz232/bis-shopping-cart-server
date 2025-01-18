const express = require('express');
const router = express.Router();
const InitDataController = require('../controllers/initData/InitDataController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const initDataController = new InitDataController(redisClientService);

    router.get('/init-product-data', [], (...args) => initDataController.initProductData(...args));


    return router;
};
