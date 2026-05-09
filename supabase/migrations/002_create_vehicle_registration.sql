-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
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
  event_id UUID,
  zone_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
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
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID,
  name TEXT NOT NULL,
  capacity INTEGER,
  occupancy INTEGER DEFAULT 0,
  price FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, name)
);

-- Create registration_tickets table with event and time tracking
CREATE TABLE IF NOT EXISTS registration_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL,
  event_id UUID NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_event_id ON vehicles(event_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg_number ON vehicles(reg_number);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_event_id ON registration_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_vehicle_id ON registration_tickets(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_ticket_id ON registration_tickets(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_issued_at ON registration_tickets(issued_at);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can create own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can create vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Anyone can read events" ON events;
DROP POLICY IF EXISTS "Anyone can read zones" ON zones;
DROP POLICY IF EXISTS "Anyone can read tickets" ON registration_tickets;
DROP POLICY IF EXISTS "Staff can create tickets" ON registration_tickets;
DROP POLICY IF EXISTS "Staff can update tickets" ON registration_tickets;
DROP POLICY IF EXISTS "Anyone can create tickets" ON registration_tickets;
DROP POLICY IF EXISTS "Anyone can update tickets" ON registration_tickets;

-- RLS Policies for vehicles - allow all for now
CREATE POLICY "Users can read all vehicles" ON vehicles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create vehicles" ON vehicles
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update vehicles" ON vehicles
  FOR UPDATE USING (TRUE);

-- RLS Policies for events - allow all
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (TRUE);

-- RLS Policies for zones - allow all
CREATE POLICY "Anyone can read zones" ON zones
  FOR SELECT USING (TRUE);

-- RLS Policies for registration_tickets - allow all
CREATE POLICY "Anyone can read tickets" ON registration_tickets
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can create tickets" ON registration_tickets
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can update tickets" ON registration_tickets
  FOR UPDATE USING (TRUE);

-- Create storage bucket for vehicle images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;
