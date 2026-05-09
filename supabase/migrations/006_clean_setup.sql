-- Clean setup - create all tables from scratch
-- This migration ensures all tables exist with proper structure

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS registration_tickets CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create zones table
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER,
  occupancy INTEGER DEFAULT 0,
  price FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, name)
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID,
  reg_number TEXT NOT NULL UNIQUE,
  chassis_number TEXT UNIQUE,
  make TEXT,
  model TEXT,
  year INTEGER,
  price FLOAT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sold', 'in_garage')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_complete BOOLEAN DEFAULT FALSE,
  description TEXT,
  features JSONB,
  images JSONB,
  at_event BOOLEAN DEFAULT FALSE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registration_tickets table
CREATE TABLE registration_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  reg_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  owner_name TEXT,
  owner_phone TEXT,
  owner_id_number TEXT,
  amount_paid FLOAT,
  zone_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  qr_data JSONB,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_vehicles_event_id ON vehicles(event_id);
CREATE INDEX idx_vehicles_reg_number ON vehicles(reg_number);
CREATE INDEX idx_zones_event_id ON zones(event_id);
CREATE INDEX idx_registration_tickets_event_id ON registration_tickets(event_id);
CREATE INDEX idx_registration_tickets_vehicle_id ON registration_tickets(vehicle_id);
CREATE INDEX idx_registration_tickets_ticket_id ON registration_tickets(ticket_id);
CREATE INDEX idx_registration_tickets_issued_at ON registration_tickets(issued_at);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_tickets ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Allow all select" ON vehicles FOR SELECT USING (TRUE);
CREATE POLICY "Allow all insert" ON vehicles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow all update" ON vehicles FOR UPDATE USING (TRUE);

CREATE POLICY "Allow all select" ON events FOR SELECT USING (TRUE);
CREATE POLICY "Allow all insert" ON events FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all select" ON zones FOR SELECT USING (TRUE);
CREATE POLICY "Allow all insert" ON zones FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow all select" ON registration_tickets FOR SELECT USING (TRUE);
CREATE POLICY "Allow all insert" ON registration_tickets FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow all update" ON registration_tickets FOR UPDATE USING (TRUE);

-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;
