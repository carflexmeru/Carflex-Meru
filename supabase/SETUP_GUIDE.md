# Carflex Database Setup Guide

This guide walks you through setting up the Carflex database with Supabase.

## Prerequisites

- Supabase project created and configured
- Environment variables set in `.env.local`:
  - `DATABASE_URL` - PostgreSQL connection string
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key

## Step 1: Run Initial Migrations

Run the migrations in order:

```bash
# 1. Create storage buckets and policies
supabase migration up 001_create_staff_agents.sql

# 2. Create vehicle registration tables
supabase migration up 002_create_vehicle_registration.sql

# 3. Seed staff agents (optional - for reference)
supabase migration up 003_seed_staff_agents.sql

# 4. Fix staff agents schema
supabase migration up 004_fix_staff_agents_schema.sql

# 5. Seed events and zones
supabase migration up 005_seed_events_and_zones.sql

# 6. Clean setup (creates all tables from scratch)
supabase migration up 006_clean_setup.sql
```

## Step 2: Create Auth Users in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user** and create the following users:

### Staff Credentials

| Email | Password | Type |
|-------|----------|------|
| registration@carflex.com | Registration@Carflex123 | REGISTRATION_AGENT |
| gate@carflex.com | Gate@Carflex123 | GATE_VERIFICATION_AGENT |
| ground@carflex.com | Ground@Carflex123 | GROUND_VERIFICATION_AGENT |
| exit@carflex.com | Exit@Carflex123 | EXIT_COMMAND_AGENT |

**Important**: After creating each user, note their UUID from the Supabase dashboard.

## Step 3: Populate Staff Agents Table

After creating auth users, you need to link them to the `staff_agents` table.

### Option A: Using SQL Editor (Recommended)

1. Go to Supabase dashboard > SQL Editor
2. Run the following query, replacing the UUIDs with the actual auth user IDs:

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('AUTH_USER_ID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('AUTH_USER_ID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('AUTH_USER_ID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('AUTH_USER_ID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

### Option B: Using Migration File

1. Edit `supabase/migrations/007_populate_staff_agents.sql`
2. Replace the example UUIDs with actual auth user IDs
3. Run the migration

## Step 4: Verify Setup

1. Test staff login at `/staff/login`
2. Use credentials from the table above
3. Each staff member should be redirected to their respective dashboard:
   - Registration Agent → `/staff/registration`
   - Gate Verification Agent → `/staff/gate`
   - Ground Verification Agent → `/staff/ground`
   - Exit Command Agent → `/staff/exit`

## Database Schema

### staff_agents
- `id` (UUID) - Primary key, matches auth.users.id
- `email` (TEXT) - Unique email address
- `name` (TEXT) - Staff member name
- `type` (TEXT) - Staff role (REGISTRATION_AGENT, GATE_VERIFICATION_AGENT, etc.)
- `last_login` (TIMESTAMP) - Last login timestamp
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### vehicles
- `id` (UUID) - Primary key
- `owner_id` (UUID) - Reference to auth.users
- `reg_number` (TEXT) - Registration number (unique)
- `event_id` (UUID) - Reference to events
- `zone_id` (UUID) - Reference to zones
- `status` (TEXT) - Vehicle status (draft, active, sold, in_garage)
- `is_verified` (BOOLEAN) - Verification status
- `is_complete` (BOOLEAN) - Completion status
- Other fields: chassis_number, make, model, year, price, description, features, images

### events
- `id` (UUID) - Primary key
- `name` (TEXT) - Event name (unique)
- `location` (TEXT) - Event location
- `start_date` (TIMESTAMP) - Event start date
- `end_date` (TIMESTAMP) - Event end date
- `is_active` (BOOLEAN) - Active status

### zones
- `id` (UUID) - Primary key
- `event_id` (UUID) - Reference to events
- `name` (TEXT) - Zone name
- `capacity` (INTEGER) - Zone capacity
- `occupancy` (INTEGER) - Current occupancy
- `price` (FLOAT) - Zone price

### registration_tickets
- `id` (UUID) - Primary key
- `ticket_id` (TEXT) - Unique ticket identifier
- `vehicle_id` (UUID) - Reference to vehicles
- `event_id` (UUID) - Reference to events
- `status` (TEXT) - Ticket status (active, used, expired)
- `issued_at` (TIMESTAMP) - Issue timestamp
- `expires_at` (TIMESTAMP) - Expiration timestamp
- `used_at` (TIMESTAMP) - Usage timestamp
- Other fields: reg_number, make, model, year, owner_name, owner_phone, owner_id_number, amount_paid, zone_name, qr_data

## Troubleshooting

### "Staff record not found" error
- Ensure auth user was created in Supabase dashboard
- Verify the auth user ID matches the `id` in staff_agents table
- Check that the email matches exactly

### "Invalid credentials" error
- Verify email and password are correct
- Ensure auth user is enabled (not disabled) in Supabase dashboard
- Check that the user was created with email/password authentication

### Foreign key constraint errors
- Ensure all referenced tables exist (events, zones, vehicles)
- Run migrations in order
- Check that event_id and zone_id exist before creating vehicles

## Storage Buckets

Two storage buckets are created:

1. **staff-documents** (private)
   - For staff document uploads
   - Only staff can access their own documents

2. **vehicle-images** (public)
   - For vehicle images
   - Anyone can view, authenticated users can upload

## Next Steps

1. Create events and zones in the database
2. Register vehicles through the registration API
3. Generate tickets for vehicles
4. Use staff dashboards to manage the workflow
