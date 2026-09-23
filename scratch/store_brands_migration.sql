-- Migration: Add Store Brands
CREATE TABLE store_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(2048),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_store_brands_updated_at BEFORE UPDATE ON store_brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_store_brands_store_id ON store_brands(store_id);

ALTER TABLE products ADD COLUMN brand_id UUID REFERENCES store_brands(id) ON DELETE SET NULL;
CREATE INDEX idx_products_brand_id ON products(brand_id);
