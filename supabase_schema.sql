-- Carflex Master Ecosystem: 18-Table Supabase Schema

-- 1. Profiles & Roles
CREATE TYPE user_role AS ENUM ('buyer', 'vendor', 'staff', 'admin');
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'buyer',
    avatar_url TEXT,
    id_number TEXT,
    id_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Parking Zones
CREATE TABLE zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- e.g., 'Zone P', 'Premium', 'General'
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    fee_kes DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Vehicles (Listings)
CREATE TYPE vehicle_status AS ENUM ('draft', 'verified', 'sold', 'archived', 'rejected');
CREATE TABLE vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id),
    plate_number TEXT UNIQUE NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    price_kes DECIMAL(15, 2),
    mileage INTEGER,
    transmission TEXT,
    fuel_type TEXT,
    engine_capacity TEXT,
    specs JSONB DEFAULT '{}',
    description TEXT,
    zone_id UUID REFERENCES zones(id),
    status vehicle_status DEFAULT 'draft',
    is_listing_complete BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Bookings (Gate Entries)
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id),
    agent_id UUID REFERENCES profiles(id), -- Agent 1
    amount_paid DECIMAL(10, 2),
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    payment_method TEXT, -- 'mpesa', 'cash'
    transaction_ref TEXT,
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    exit_time TIMESTAMP WITH TIME ZONE
);

-- 5. Offers (Bids)
CREATE TYPE offer_status AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
CREATE TABLE offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id),
    buyer_id UUID REFERENCES profiles(id),
    amount_kes DECIMAL(15, 2) NOT NULL,
    status offer_status DEFAULT 'pending',
    is_highly_committed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Negotiations (Chat Rooms)
CREATE TABLE negotiations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id),
    buyer_id UUID REFERENCES profiles(id),
    seller_id UUID REFERENCES profiles(id),
    last_message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Messages
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    negotiation_id UUID REFERENCES negotiations(id),
    sender_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    media_url TEXT,
    type TEXT DEFAULT 'text', -- 'text', 'image', 'location'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Transactions (Master Ledger)
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    amount DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'KES',
    purpose TEXT, -- 'gate_fee', 'garage_service', 'part_purchase', 'training_deposit'
    status TEXT DEFAULT 'pending',
    provider TEXT, -- 'paystack', 'mpesa', 'internal'
    provider_ref TEXT UNIQUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Audit Logs
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    payload JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Garage Jobs
CREATE TABLE garage_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id),
    owner_id UUID REFERENCES profiles(id),
    mechanic_id UUID REFERENCES profiles(id),
    service_type TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 11. Parts Catalog
CREATE TABLE parts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    compatibility JSONB, -- Array of models
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 12. Training Courses
CREATE TABLE training_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 13. Training Enrollments
CREATE TABLE training_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id),
    course_id UUID REFERENCES training_courses(id),
    status TEXT DEFAULT 'interested', -- 'interested', 'enrolled', 'graduated', 'dropped'
    balance_kes DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 14. Import Orders
CREATE TABLE import_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    vehicle_details TEXT,
    source_country TEXT, -- 'Japan', 'UK'
    status TEXT DEFAULT 'ordered', -- 'ordered', 'shipped', 'arrived', 'cleared'
    tracking_number TEXT,
    vessel_name TEXT,
    estimated_arrival DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 15. Staff Shifts
CREATE TABLE staff_shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID REFERENCES profiles(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    cash_collected DECIMAL(10, 2) DEFAULT 0,
    digital_collected DECIMAL(10, 2) DEFAULT 0,
    notes TEXT
);

-- 16. Blacklisted Plates
CREATE TABLE blacklisted_plates (
    plate_number TEXT PRIMARY KEY,
    reason TEXT,
    flagged_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 17. Event Schedule
CREATE TABLE event_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 18. System Configs
CREATE TABLE system_configs (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS & Realtime Enabling (Quick Setup)
ALTER PUBLICATION supabase_realtime ADD TABLE messages, offers, negotiations, vehicles;
