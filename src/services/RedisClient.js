const { promisify } = require('util');

class RedisClient {
    constructor(redisClient) {
        // ['hGetAll', 'hSet', 'hGet', 'hDel', 'hIncrBy', 'del', 'scan'].forEach(
        //     method => (redisClient[method] = promisify(redisClient[method]))
        // );
        //
        // redisClient.json.get = promisify(redisClient.json.get)
        // redisClient.json.set = promisify(redisClient.json.set)

        this.redis = redisClient;
    }

    async scan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = '0') => {
            try {
                const {cursor: newCursor, keys: matchingKeys} = await this.redis.scan(cursor, 'MATCH', pattern);
                console.log(newCursor)
                cursor = newCursor;


                matchingKeysCount += matchingKeys.length;
                keys = keys.concat(matchingKeys);

                console.log(keys)

                if (cursor == 0) {
                    return keys;
                } else {
                    return await recursiveScan(cursor);
                }
            } catch (e) {
                return keys;
            }
       };

        return await recursiveScan();
    }

    jsonGet(key) {
        console.log(this.redis.json.get)
        return this.redis.json.get(key);
    }

    jsonSet(key, path, json) {
        return this.redis.json.set(key, path, json);
    }

    hGetAll(key) {
        return this.redis.hGetAll(key);
    }

    hSet(hash, key, value) {
        return this.redis.hSet(hash, key, value);
    }

    hGet(hash, key) {
        return this.redis.hGet(hash, key);
    }

    hDel(hash, key) {
        return this.redis.hDel(hash, key);
    }

    hIncrBy(hash, key, incr) {
        return this.redis.hIncrBy(hash, key, incr);
    }

    del(key) {
        return this.redis.del(key);
    }
}

module.exports = RedisClient;
