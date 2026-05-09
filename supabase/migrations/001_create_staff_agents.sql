-- Create staff_agents table
CREATE TABLE IF NOT EXISTS staff_agents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create RLS policy for staff to read their own data
CREATE POLICY "Staff can read own data" ON staff_agents
  FOR SELECT USING (auth.uid() = id);

-- Create RLS policy for staff to update their own data
CREATE POLICY "Staff can update own data" ON staff_agents
  FOR UPDATE USING (auth.uid() = id);

-- Create storage bucket for staff documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-documents', 'staff-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for staff storage
CREATE POLICY "Staff can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can read own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can delete own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
