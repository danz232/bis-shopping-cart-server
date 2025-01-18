class CartIndexController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        // const { cartId } = req.session;

        const {userId} = req.query;

        const cartDataJSON = await this.redisClientService.jsonGet(`cart:${userId}`);

        const cartData = cartDataJSON ? JSON.parse(cartDataJSON) : {};

        let productList = [];

        const cartItemKeys = await this.redisClientService.scan(`cart-item:${userId}:*`)
        // const cartItems = await this.redisClientService.scan(`foo:*`)

        for (let itemKey of cartItemKeys) {
             if (itemKey.indexOf(`cart-item:${userId}:`) === -1) {continue}


             const cartItem = {
                 product: itemKey.split(":")[2]
             }

            const cartItemQty = await this.redisClientService.hGet(itemKey, "qty")

            if (!cartItemQty) {continue}

            cartItem.qty = parseInt(cartItemQty);

            productList.push(cartItem);
        }

        cartData.cartItems = productList

        // const cartList = await this.redisClientService.hGetAll(`cart:${cartId}`);

        // if (!cartList) {
        //     return res.send(productList);
        // }
        //
        // for (const itemKey of Object.keys(cartList)) {
        //     const product = await this.redisClientService.jsonGet(itemKey);
        //
        //     productList.push({ product: JSON.parse(product), quantity: cartList[itemKey] });
        // }

        return res.send(cartData);
    }

    async getAllCartItemKeys(userId) {

    }
}

module.exports = CartIndexController;
