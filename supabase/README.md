# Supabase Database Setup for Carflex

This directory contains all database migrations and setup instructions for the Carflex vehicle registration system.

## Quick Start

### 1. Prerequisites
- Supabase project created
- Environment variables configured in `.env.local`
- Supabase CLI installed (optional, for running migrations)

### 2. Run Migrations

Run migrations in this order:

```bash
# Option A: Using Supabase CLI
supabase migration up

# Option B: Using SQL Editor in Supabase Dashboard
# Copy and paste each migration file into the SQL Editor
```

**Migration Order:**
1. `001_create_staff_agents.sql` - Create storage buckets
2. `002_create_vehicle_registration.sql` - Create main tables
3. `003_seed_staff_agents.sql` - Reference only (do not run)
4. `004_fix_staff_agents_schema.sql` - Create staff_agents table
5. `005_seed_events_and_zones.sql` - Seed sample data
6. `006_clean_setup.sql` - Alternative clean setup
7. `007_populate_staff_agents.sql` - Link auth users to staff_agents

### 3. Create Auth Users

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user"
3. Create these 4 users:

| Email | Password | Type |
|-------|----------|------|
| registration@carflex.com | Registration@Carflex123 | REGISTRATION_AGENT |
| gate@carflex.com | Gate@Carflex123 | GATE_VERIFICATION_AGENT |
| ground@carflex.com | Ground@Carflex123 | GROUND_VERIFICATION_AGENT |
| exit@carflex.com | Exit@Carflex123 | EXIT_COMMAND_AGENT |

**Important**: Copy each user's UUID after creation.

### 4. Link Auth Users to Staff Agents

Run this SQL in Supabase SQL Editor (replace UUIDs):

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('UUID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('UUID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

### 5. Test Login

1. Go to `http://localhost:3000/staff/login`
2. Select staff type from dropdown
3. Enter email and password
4. Click "INITIATE ACCESS"

## File Structure

```
supabase/
├── migrations/
│   ├── 001_create_staff_agents.sql
│   ├── 002_create_vehicle_registration.sql
│   ├── 003_seed_staff_agents.sql
│   ├── 004_fix_staff_agents_schema.sql
│   ├── 005_seed_events_and_zones.sql
│   ├── 006_clean_setup.sql
│   └── 007_populate_staff_agents.sql
├── README.md (this file)
├── SETUP_GUIDE.md
├── STAFF_CREDENTIALS.md
└── STAFF_SETUP_INSTRUCTIONS.md
```

## Database Schema

### staff_agents
Staff member accounts linked to Supabase Auth users.

```sql
CREATE TABLE staff_agents (
  id UUID PRIMARY KEY,                    -- Matches auth.users.id
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,                     -- REGISTRATION_AGENT, GATE_VERIFICATION_AGENT, etc.
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### vehicles
Vehicle registration records.

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  owner_id UUID,                          -- Reference to auth.users
  reg_number TEXT NOT NULL UNIQUE,
  event_id UUID,                          -- Reference to events
  zone_id UUID,                           -- Reference to zones
  status TEXT,                            -- draft, active, sold, in_garage
  is_verified BOOLEAN,
  is_complete BOOLEAN,
  -- ... other fields
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### events
Event records for vehicle registration events.

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### zones
Parking zones within events.

```sql
CREATE TABLE zones (
  id UUID PRIMARY KEY,
  event_id UUID,                          -- Reference to events
  name TEXT NOT NULL,
  capacity INTEGER,
  occupancy INTEGER,
  price FLOAT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(event_id, name)
);
```

### registration_tickets
Tickets generated for registered vehicles.

```sql
CREATE TABLE registration_tickets (
  id UUID PRIMARY KEY,
  ticket_id TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL,              -- Reference to vehicles
  event_id UUID NOT NULL,                -- Reference to events
  status TEXT,                           -- active, used, expired
  issued_at TIMESTAMP WITH TIME ZONE,    -- When ticket was issued
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,      -- When ticket was used
  -- ... other fields
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## Storage Buckets

### staff-documents (Private)
- For staff document uploads
- Only staff can access their own documents
- Policies: Upload, Read, Delete (own documents only)

### vehicle-images (Public)
- For vehicle images
- Anyone can view
- Authenticated users can upload
- Users can delete their own images

## Common Issues

### "Staff record not found" error
**Cause**: Auth user exists but not linked to staff_agents table.

**Solution**:
1. Get the auth user's UUID from Supabase dashboard
2. Run the INSERT statement in Step 4 above

### "Invalid credentials" error
**Cause**: Email/password incorrect or user disabled.

**Solution**:
1. Verify email and password are correct
2. Check user is enabled in Supabase dashboard
3. Ensure user was created with email/password auth

### Foreign key constraint errors
**Cause**: Referenced table doesn't exist or migration order wrong.

**Solution**:
1. Run migrations in order
2. Verify all tables exist: `SELECT * FROM information_schema.tables;`
3. Check foreign key references

### "Column does not exist" error
**Cause**: Migration didn't run or table structure is wrong.

**Solution**:
1. Check migration ran successfully
2. Verify table structure: `\d table_name`
3. Re-run migration if needed

## Workflow

1. **Registration Agent** (`registration@carflex.com`)
   - Registers vehicles
   - Generates tickets
   - Dashboard: `/staff/registration`

2. **Gate Verification Agent** (`gate@carflex.com`)
   - Approves pending vehicles
   - Views approved vehicles with QR codes
   - Dashboard: `/staff/gate`

3. **Ground Verification Agent** (`ground@carflex.com`)
   - Scans QR codes
   - Verifies vehicles on ground
   - Dashboard: `/staff/ground`

4. **Exit Command Agent** (`exit@carflex.com`)
   - Authorizes vehicle departure
   - Views approved vehicles
   - Dashboard: `/staff/exit`

## API Endpoints

### Authentication
- `POST /api/staff/auth/login` - Staff login
- `POST /api/staff/auth/register` - Staff registration
- `POST /api/staff/auth/logout` - Staff logout

### Vehicles
- `POST /api/vehicles/register` - Register vehicle
- `GET /api/vehicles/tickets` - Get all tickets
- `GET /api/vehicles/approved` - Get approved vehicles
- `POST /api/vehicles/validate-ticket` - Validate ticket
- `POST /api/vehicles/use-ticket` - Mark ticket as used

### Admin
- `POST /api/admin/staff/update-password` - Update staff password

## Environment Variables

Required in `.env.local`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review SETUP_GUIDE.md for detailed instructions
3. Check STAFF_CREDENTIALS.md for credential information
4. Review Supabase documentation: https://supabase.com/docs
