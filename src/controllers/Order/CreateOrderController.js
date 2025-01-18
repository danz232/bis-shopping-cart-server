const CartIndexController = require("../Cart/IndexController");
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

// Set up the request

class CreateOrderController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async createOrder(req, res) {
        const {userId} = req.params;

        const cartIndexController = new CartIndexController(this.redisClientService);

        const cartData = await cartIndexController.getCartData(userId);

        console.log(cartData)

        const deleteOptions = {
            host: 'localhost',
            port: '3000',
            path: `/api/cart/?userId=${userId}`,
            method: 'DELETE',

        }

        const delReq = http.request(deleteOptions, (res) => {
            console.log(res.statusCode)
        })

        delReq.write("")
        delReq.end()

        return res.send({productsInOrder: cartData.cartItems});
    }

}

module.exports = CreateOrderController;
