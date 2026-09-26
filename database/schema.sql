-- PolarOps Command Center Database Schema (PostgreSQL)
-- Ministry of Earth Sciences (MoES) / National Centre for Polar and Ocean Research (NCPOR)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Expeditions Table
CREATE TABLE IF NOT EXISTS expeditions (
    expedition_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    base VARCHAR(255) NOT NULL,
    leader VARCHAR(255) NOT NULL,
    phase VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expeditions_status ON expeditions(status);

-- 3. Personnel Table
CREATE TABLE IF NOT EXISTS personnel (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    contact VARCHAR(100),
    emergency_contact VARCHAR(100),
    training_status VARCHAR(100),
    medical_clearance VARCHAR(100),
    current_location VARCHAR(255) NOT NULL,
    expedition_id INT REFERENCES expeditions(expedition_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_personnel_status ON personnel(status);
CREATE INDEX IF NOT EXISTS idx_personnel_expedition_id ON personnel(expedition_id);
CREATE INDEX IF NOT EXISTS idx_personnel_current_location ON personnel(current_location);

-- 4. Cargo Table
CREATE TABLE IF NOT EXISTS cargo (
    cargo_id SERIAL PRIMARY KEY,
    cargo_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    weight NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    expected_arrival DATE,
    actual_arrival DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cargo_status ON cargo(status);
CREATE INDEX IF NOT EXISTS idx_cargo_priority ON cargo(priority);
CREATE INDEX IF NOT EXISTS idx_cargo_destination ON cargo(destination);

-- 5. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    minimum_threshold NUMERIC(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    consumption_rate NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

-- 6. Inventory Usage History Table (for depletion predictions)
CREATE TABLE IF NOT EXISTS inventory_usage_history (
    usage_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES inventory(item_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    quantity_used NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_item_id ON inventory_usage_history(item_id);
CREATE INDEX IF NOT EXISTS idx_usage_date ON inventory_usage_history(date);
CREATE INDEX IF NOT EXISTS idx_usage_item_date ON inventory_usage_history(item_id, date);

-- 7. Assets Table
CREATE TABLE IF NOT EXISTS assets (
    asset_id SERIAL PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    assigned_team VARCHAR(255),
    last_maintenance DATE,
    next_maintenance DATE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(current_location);
CREATE INDEX IF NOT EXISTS idx_assets_next_maintenance ON assets(next_maintenance);

-- 8. Emergency Incidents Table
CREATE TABLE IF NOT EXISTS emergency_incidents (
    incident_id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    affected_person VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    response_team VARCHAR(255),
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_incidents(status);
CREATE INDEX IF NOT EXISTS idx_emergency_severity ON emergency_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_emergency_timestamp ON emergency_incidents(timestamp);
