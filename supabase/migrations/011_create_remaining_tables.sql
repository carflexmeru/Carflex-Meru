-- Create remaining tables for Supabase
-- This migration safely creates tables that may not exist yet

-- 1. Profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  email TEXT UNIQUE,
  name TEXT,
  id_number TEXT UNIQUE,
  role TEXT DEFAULT 'buyer',
  avatar_url TEXT,
  business_address TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Organization table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rep_name TEXT,
  rep_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Booking table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  zone_id UUID REFERENCES zones(id),
  agent_id UUID REFERENCES profiles(id),
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_amount DECIMAL(10, 2),
  check_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ExitPass table
CREATE TABLE IF NOT EXISTS exit_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES bookings(id),
  qr_jwt_hash TEXT UNIQUE,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Offer table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  buyer_id UUID REFERENCES profiles(id),
  amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Message table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Transaction table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10, 2),
  method TEXT,
  reference TEXT UNIQUE,
  agent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CashLog table
CREATE TABLE IF NOT EXISTS cash_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id),
  opening_bal DECIMAL(10, 2),
  closing_bal DECIMAL(10, 2),
  handover_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. VehicleView table
CREATE TABLE IF NOT EXISTS vehicle_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  viewer_id UUID REFERENCES profiles(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Favorite table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  vehicle_id UUID REFERENCES vehicles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- 11. NewsletterSub table
CREATE TABLE IF NOT EXISTS newsletter_subs (
  email TEXT PRIMARY KEY,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. CollegeLead table
CREATE TABLE IF NOT EXISTS college_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_pref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. GarageJob table
CREATE TABLE IF NOT EXISTS garage_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  owner_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. SystemSetting table
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. SupportTicket table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  issue_type TEXT,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. AuditLog table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. ActionLog table
CREATE TABLE IF NOT EXISTS action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_type TEXT,
  agent_name TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. RawListing table
CREATE TABLE IF NOT EXISTS raw_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_reg_num TEXT,
  owner_phone TEXT,
  owner_id_number TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  gate_entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. StolenVehicle table
CREATE TABLE IF NOT EXISTS stolen_vehicles (
  reg_number TEXT PRIMARY KEY,
  reported_by_id UUID REFERENCES profiles(id),
  report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_zone_id ON bookings(zone_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_offers_vehicle_id ON offers(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_tickets ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can view all bookings" ON bookings FOR SELECT USING (TRUE);
CREATE POLICY "Users can view all offers" ON offers FOR SELECT USING (TRUE);
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (TRUE);
CREATE POLICY "Users can view all transactions" ON transactions FOR SELECT USING (TRUE);
CREATE POLICY "Users can view all registration tickets" ON registration_tickets FOR SELECT USING (TRUE);
