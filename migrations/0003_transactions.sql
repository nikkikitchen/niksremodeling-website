-- Durable checkout attempts. Payment redirects never change payment state.
CREATE TABLE IF NOT EXISTS checkout_orders (
 id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('retail','project')),
 environment TEXT NOT NULL CHECK(environment IN ('sandbox','production')),
 status TEXT NOT NULL DEFAULT 'creating' CHECK(status IN ('creating','pending','paid','review')),
 total_cents INTEGER NOT NULL CHECK(total_cents>0), currency TEXT NOT NULL DEFAULT 'USD',
 customer_json TEXT NOT NULL CHECK(json_valid(customer_json)), quote_json TEXT NOT NULL CHECK(json_valid(quote_json)),
 project_quote_id TEXT, payment_mode TEXT, square_order_id TEXT UNIQUE, payment_url TEXT,
 payment_id TEXT UNIQUE, receipt_url TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 paid_at TEXT, fulfillment_status TEXT NOT NULL DEFAULT 'hold' CHECK(fulfillment_status='hold')
);
CREATE TABLE IF NOT EXISTS project_quotes (
 id TEXT PRIMARY KEY, token TEXT NOT NULL UNIQUE, customer_name TEXT NOT NULL, customer_email TEXT NOT NULL,
 project_name TEXT NOT NULL, scope TEXT NOT NULL, items_json TEXT NOT NULL CHECK(json_valid(items_json)),
 total_cents INTEGER NOT NULL CHECK(total_cents>0), deposit_cents INTEGER NOT NULL CHECK(deposit_cents>0 AND deposit_cents<=total_cents),
 allow_full INTEGER NOT NULL DEFAULT 0 CHECK(allow_full IN (0,1)),
 approved_by TEXT NOT NULL, approved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, expires_at TEXT NOT NULL,
 revoked INTEGER NOT NULL DEFAULT 0 CHECK(revoked IN (0,1)), active_checkout_id TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS scheduling_requests (
 id TEXT PRIMARY KEY, request_key TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL,
 customer_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
 preferred_date TEXT NOT NULL, zip TEXT NOT NULL, project_details TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','accepted','declined')),
 owner_note TEXT NOT NULL DEFAULT '', reviewed_by TEXT, reviewed_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS checkout_project ON checkout_orders(project_quote_id);
CREATE INDEX IF NOT EXISTS scheduling_status ON scheduling_requests(status,created_at);
