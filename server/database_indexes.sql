-- ==============================================================================
-- ZAALIMA E-COMMERCE PLATFORM
-- DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION (DAY 26)
-- ==============================================================================
-- Run these commands in your Supabase SQL Editor to speed up database queries
-- before deploying to production.
-- ==============================================================================

-- 1. Index on users(clerk_user_id)
-- We query the users table by clerk_user_id on almost every single API request
-- via our roleMiddleware and auth sync. This index will make auth checks lightning fast.
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- 2. Index on stores(owner_user_id)
-- Used when a Vendor logs in to fetch their specific store details.
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_user_id);

-- 3. Index on products(store_id)
-- Speeds up queries for the Vendor Dashboard and the Public Storefront grids.
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- 4. Index on orders(store_id) and orders(payment_status)
-- Speeds up Vendor Analytics and Admin Analytics where we SUM() and COUNT()
-- orders that belong to a specific store and have a 'SUCCESS' payment_status.
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- 5. Index on order_items(order_id)
-- Speeds up fetching line items when reviewing a specific order.
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Optional: Compound index for complex analytical queries (e.g., getting revenue over time for a store)
CREATE INDEX IF NOT EXISTS idx_orders_store_status_date ON orders(store_id, payment_status, created_at);

-- ==============================================================================
-- End of Indexes
-- ==============================================================================
