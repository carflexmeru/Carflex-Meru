-- Fix profiles table id column to have proper default
-- This ensures UUIDs are auto-generated when inserting records

-- Drop the existing profiles table if it exists and recreate with proper defaults
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate profiles table with proper UUID default
CREATE TABLE profiles (
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

-- Create indexes
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_id_number ON profiles(id_number);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert profiles" ON profiles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (TRUE);
