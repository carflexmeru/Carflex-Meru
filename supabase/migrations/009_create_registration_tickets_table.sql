-- Create registration_tickets table in Supabase
CREATE TABLE IF NOT EXISTS registration_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  event_id UUID,
  reg_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  owner_name TEXT,
  owner_phone TEXT,
  owner_id_number TEXT,
  amount_paid DECIMAL(10, 2),
  zone_name TEXT,
  status TEXT DEFAULT 'active',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  qr_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registration_tickets_ticket_id ON registration_tickets(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_vehicle_id ON registration_tickets(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_event_id ON registration_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_status ON registration_tickets(status);
CREATE INDEX IF NOT EXISTS idx_registration_tickets_reg_number ON registration_tickets(reg_number);

-- Enable RLS
ALTER TABLE registration_tickets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Anyone can view registration tickets" ON registration_tickets;
DROP POLICY IF EXISTS "Users can insert registration tickets" ON registration_tickets;

CREATE POLICY "Anyone can view registration tickets" ON registration_tickets
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert registration tickets" ON registration_tickets
  FOR INSERT WITH CHECK (TRUE);
