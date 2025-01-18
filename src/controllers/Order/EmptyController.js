const {StatusCodes} = require('http-status-codes');
const CartDeleteItemController = require("./DeleteItemController");

class CartEmptyController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const {userId} = req.query;

        const cartItemKeys = await this.redisClientService.scan(`cart-item:${userId}:*`)

        console.log("hello: ", cartItemKeys)

        if (!cartItemKeys || !cartItemKeys.length) {
            return res.sendStatus(StatusCodes.NO_CONTENT);
        }

        const cartDeleteItemController = new CartDeleteItemController(this.redisClientService);

        for (const key of cartItemKeys) {
            console.log(key)
            if (key.indexOf(`cart-item:${userId}:`) === -1) {
                continue
            }

            const keySplit = key.split(":")
            console.log(keySplit)

            await cartDeleteItemController.deleteCartItem(keySplit[1], keySplit[2]);
        }

        await this.redisClientService.del(`cart:${userId}`);

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = CartEmptyController;
