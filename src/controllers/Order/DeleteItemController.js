const {StatusCodes} = require('http-status-codes');

class CartDeleteItemController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const {id: productId} = req.params;
        const {userId} = req.query

        await this.deleteCartItem(userId, productId)

        return res.sendStatus(StatusCodes.OK);
   }

    async deleteCartItem(userId, productId) {
        const quantityInCart =
            parseInt(await this.redisClientService.hGet(`cart-item:${userId}:${productId}`, `qty`)) || 0;

        if (quantityInCart) {
            await this.redisClientService.del(`cart-item:${userId}:${productId}`);

            let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += quantityInCart;

            await this.redisClientService.jsonSet(`product:${productId}`, '$', JSON.stringify(productInStore));
        }
    }
}

module.exports = CartDeleteItemController;
