-- Create vehicles table in Supabase
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  reg_number TEXT NOT NULL UNIQUE,
  make TEXT,
  model TEXT,
  year INTEGER,
  price DECIMAL(10, 2),
  event_id UUID,
  zone_id UUID,
  at_event BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  is_complete BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on reg_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_reg_number ON vehicles(reg_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_event_id ON vehicles(event_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;

CREATE POLICY "Users can view their own vehicles" ON vehicles
  FOR SELECT USING (owner_id = auth.uid() OR TRUE);

CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING (owner_id = auth.uid());
