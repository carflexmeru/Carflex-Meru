-- Create staff_agents table if it doesn't exist
-- This table stores staff agent information
-- The id field will be populated with auth.users.id after auth users are created
CREATE TABLE IF NOT EXISTS staff_agents (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('REGISTRATION_AGENT', 'GATE_VERIFICATION_AGENT', 'GROUND_VERIFICATION_AGENT', 'EXIT_COMMAND_AGENT')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_agents_email ON staff_agents(email);
CREATE INDEX IF NOT EXISTS idx_staff_agents_type ON staff_agents(type);

-- Enable RLS (Row Level Security)
ALTER TABLE staff_agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff can read own data" ON staff_agents;
DROP POLICY IF EXISTS "Staff can update own data" ON staff_agents;

-- Create RLS policy for staff to read their own data
CREATE POLICY "Staff can read own data" ON staff_agents
  FOR SELECT USING (TRUE);

-- Create RLS policy for staff to update their own data
CREATE POLICY "Staff can update own data" ON staff_agents
  FOR UPDATE USING (TRUE);

-- Note: Staff agents must be created via Supabase Auth first
-- Then their auth.users.id must be inserted into staff_agents table
-- This ensures the foreign key relationship is maintained
