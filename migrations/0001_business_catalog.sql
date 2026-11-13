PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS catalog_categories (
 context TEXT PRIMARY KEY, label TEXT NOT NULL, parent_context TEXT,
 CHECK(length(context) BETWEEN 3 AND 160), CHECK(length(label) BETWEEN 1 AND 120)
);
CREATE TABLE IF NOT EXISTS business_products (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
 images TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(images)),
 contexts TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(contexts)),
 supplier TEXT NOT NULL, supplier_product_id TEXT NOT NULL DEFAULT '', supplier_sku TEXT NOT NULL DEFAULT '',
 supplier_cost_cents INTEGER CHECK(supplier_cost_cents IS NULL OR supplier_cost_cents>0),
 markup_bps INTEGER NOT NULL DEFAULT 3500 CHECK(markup_bps BETWEEN 0 AND 50000),
 stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity>=0),
 warehouse_country TEXT NOT NULL DEFAULT 'US', requires_us_stock INTEGER NOT NULL DEFAULT 1 CHECK(requires_us_stock IN (0,1)),
 stock_verified_at TEXT, stock_evidence TEXT NOT NULL DEFAULT '', shipping_required INTEGER NOT NULL DEFAULT 1 CHECK(shipping_required IN (0,1)),
 shipping_notes TEXT NOT NULL DEFAULT '', unit TEXT NOT NULL DEFAULT 'each',
 installation_labor_cents INTEGER CHECK(installation_labor_cents IS NULL OR installation_labor_cents>=0),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','archived')),
 version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS products_status ON business_products(status);
CREATE TABLE IF NOT EXISTS business_projects (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, selling_total_cents INTEGER NOT NULL DEFAULT 0 CHECK(selling_total_cents>=0),
 labor_hours REAL NOT NULL DEFAULT 0 CHECK(labor_hours>=0), internal_hourly_cost_cents INTEGER CHECK(internal_hourly_cost_cents IS NULL OR internal_hourly_cost_cents>=0),
 fees_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK(fees_cost_cents>=0), notes TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS project_materials (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES business_products(id), quantity REAL NOT NULL CHECK(quantity>0),
 allowance_cents INTEGER CHECK(allowance_cents IS NULL OR allowance_cents>=0),
 shipping_cost_cents INTEGER CHECK(shipping_cost_cents IS NULL OR shipping_cost_cents>=0),
 tax_cost_cents INTEGER CHECK(tax_cost_cents IS NULL OR tax_cost_cents>=0),
 purchased_quantity REAL NOT NULL DEFAULT 0 CHECK(purchased_quantity>=0),
 UNIQUE(project_id,product_id)
);
CREATE TABLE IF NOT EXISTS project_expenses (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
 category TEXT NOT NULL CHECK(category IN ('materials','supplies','labor','shipping','tax','fees','other')),
 description TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents>=0),
 paid_at TEXT NOT NULL, created_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS package_allowances (context TEXT PRIMARY KEY, allowance_cents INTEGER NOT NULL CHECK(allowance_cents>=0));
INSERT OR IGNORE INTO package_allowances VALUES
 ('package:bathrooms/basic/faucet',12500),('package:bathrooms/basic/accessories',4500),
 ('package:bathrooms/standard/light',15000),('package:bathrooms/standard/mirror',10000),
 ('package:bathrooms/deluxe/light',15000),('package:bathrooms/deluxe/mirror',10000),('package:bathrooms/deluxe/accessories',7000);
