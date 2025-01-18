const { StatusCodes } = require('http-status-codes');
const mockProductData = require('./mock-product-data.json');
const mockUserDat = require('./mock-user-data.json');

class InitDataController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    // Scenario: CartId not found; CartItem with Associated ProductId not found, CartItem with Associated Id Found

    async initProductData(req, res) {
        console.log(mockProductData)

        for (let productData of mockProductData) {
            await this.redisClientService.jsonSet(`product:${productData.id}`, "$", JSON.stringify(productData));
        }

        return res.status(StatusCodes.OK).send({ message: "Product Data Initiated!", products: mockProductData });
    }

    async index(req, res) {
        const {
            // session: { cartId },
            // params: { id: productId }
        } = req;

        let { quantity, userId, cartId, productId } = req.body;

        console.log(`product:${productId}`)

        let productInStore = await this.redisClientService.hGet(`product:${productId}`, "name");

        console.log(productInStore)

        if (!productInStore) {
            return res.status(StatusCodes.NOT_FOUND).send({ message: "Product with this id doesn't exist" });
        }

        // Check if Cart exists
        // CartId: cart:[cartId]
        const cartItem = await this.redisClientService.jsonGet(`cart:${cartId}`);
        // TODO: create Cart if not exist, include userId
        if (!cartItem) {
            await this.redisClientService.jsonSet(`cart:${cartId}`, "$", JSON.stringify({id: cartId, userId}) )
        }

        // Start to Update ProductInCart
        // CartItemId: cart-item:[cartId]:[productId]
        let quantityInCart = (await this.redisClientService.hGet(`cart-item:${cartId}:${productId}`, `qty`)) || 0;

        quantityInCart = parseInt(quantityInCart);

        productInStore = JSON.parse(productInStore);

        const { qty: stock } = productInStore;

        if (quantity) {
            quantity = parseInt(quantity);

            if (quantity <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Quantity should be greater than 0' });
            }

            const newStock = stock - (quantity - quantityInCart);

            if (newStock < 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Not enough products in stock' });
            }

            await this.redisClientService.hSet(`cart-item:${cartId}:${productId}`, `qty`, quantity);

            productInStore.stock = newStock;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }

        // if (incrementBy) {
        //     incrementBy = parseInt(incrementBy);
        //
        //     if (incrementBy !== 1 && incrementBy !== -1) {
        //         return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Value of incrementBy should be 1 or -1' });
        //     }
        //
        //     const quantityAfterIncrement = quantityInCart + incrementBy;
        //
        //     if (quantityAfterIncrement <= 0 || stock - incrementBy < 0) {
        //         return res.status(StatusCodes.BAD_REQUEST).send({ message: "Can't decrement stock to 0" });
        //     }
        //
        //     if (stock - incrementBy < 0) {
        //         return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Not enough products in stock' });
        //     }
        //
        //     await this.redisClientService.hIncrBy(`cart:${cartId}`, `product:${productId}`, incrementBy);
        //
        //     productInStore.stock -= incrementBy;
        //
        //     await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        // }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = InitDataController;
