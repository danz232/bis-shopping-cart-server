-- Initialize Users
local users = {
    {id = "23f6732-aa0f-47aa-8ef3-941043c4db66", name = "John", email = "john@example.com", created_at = "2025-01-14"}
}

for _, user in ipairs(users) do
    local user_key = "user:" .. user.id
    redis.call("HSET", user_key, "name", user.name, "email", user.email, "created_at", user.created_at)
end

-- Initialize Products
local products = {
    {id = "15d9e06e-f201-43d0-8ac3-660baee7448d", name = "Laptop", price = 1200, available_stock = 50, created_at = "2022-01-14"},
    {id = "efa65836-1d8d-496d-9ea8-5e95415e5f15", name = "Phone", price = 800, available_stock = 20, created_at = "2023-01-14"},
    {id = "a8221742-11f9-46e8-b6c2-7f6a2447e3f0", name = "Headphones", price = 150, available_stock = 30, created_at = "2024-01-14"}
}

for _, product in ipairs(products) do
    local product_key = "product:" .. product.id
    redis.call("HSET", product_key, "name", product.name, "price", product.price, "available_stock", product.available_stock, "created_at", product.created_at)
end

-- Initialize a Cart with TTL
local cart_key = "cart:23f6732-aa0f-47aa-8ef3-941043c4db66" -- Cart for user 1
local ttl = 8 * 60 * 60    -- 8 hours in seconds

-- Add items to the cart
redis.call("HSET", cart_key, "15d9e06e-f201-43d0-8ac3-660baee7448d", 1) -- 1 Laptop
-- Set TTL for the cart
redis.call("EXPIRE", cart_key, ttl)

-- User adds more items of the same product to the Cart
redis.call("HINCRBY", cart_key, "15d9e06e-f201-43d0-8ac3-660baee7448d", 1) -- 1 Laptop

-- User adds another products to the cart
redis.call("HSET", cart_key, "efa65836-1d8d-496d-9ea8-5e95415e5f15", 1) -- 2 Phones
redis.call("HSET", cart_key, "a8221742-11f9-46e8-b6c2-7f6a2447e3f0", 1) -- 3 Headphones

-- User removes a product from the cart
redis.call("HDEL", cart_key, "efa65836-1d8d-496d-9ea8-5e95415e5f15") -- 3 Phones

-- Fetch cart items
redis.call("HGETALL", cart_key)

return "Initialization complete"
