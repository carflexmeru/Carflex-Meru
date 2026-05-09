# Migration Summary

## Overview

The Carflex database uses 7 migrations to set up the complete system. Here's what each one does:

## Migration Files

### 001_create_staff_agents.sql
**Purpose**: Create storage buckets for staff documents

**What it does**:
- Creates `staff-documents` storage bucket (private)
- Sets up RLS policies for staff document access
- Allows staff to upload, read, and delete their own documents

**Status**: ✅ Safe to run
**Dependencies**: None

---

### 002_create_vehicle_registration.sql
**Purpose**: Create main database tables for vehicle registration

**What it does**:
- Creates `vehicles` table
- Creates `events` table
- Creates `zones` table
- Creates `registration_tickets` table
- Creates indexes for performance
- Enables RLS on all tables
- Creates `vehicle-images` storage bucket

**Tables created**:
- vehicles (vehicle registration records)
- events (event records)
- zones (parking zones)
- registration_tickets (generated tickets)

**Status**: ✅ Safe to run
**Dependencies**: None

---

### 003_seed_staff_agents.sql
**Purpose**: Reference documentation only

**What it does**:
- Contains example SQL for seeding staff agents
- **DO NOT RUN** - This will fail because staff_agents table doesn't exist yet

**Status**: ⚠️ Reference only - DO NOT RUN
**Dependencies**: None

---

### 004_fix_staff_agents_schema.sql
**Purpose**: Create staff_agents table with proper schema

**What it does**:
- Creates `staff_agents` table with UUID primary key
- Creates indexes on email and type
- Enables RLS
- Creates RLS policies for staff access
- **Does NOT insert data** - Auth users must be created first

**Table created**:
- staff_agents (staff member accounts)

**Important**: 
- The `id` field must match `auth.users.id` from Supabase Auth
- Auth users must be created in Supabase dashboard BEFORE running this migration
- Staff agents are linked to auth users in migration 007

**Status**: ✅ Safe to run
**Dependencies**: None

---

### 005_seed_events_and_zones.sql
**Purpose**: Seed sample events and zones

**What it does**:
- Creates 2 sample events:
  - "Meru Car Bazaar 2026"
  - "Meru 10th Anniversary 2026"
- Creates 3 zones for each event
- Creates `admin_logs` table for audit trail

**Sample data**:
- Events with start/end dates
- Zones with capacity and pricing

**Status**: ✅ Safe to run
**Dependencies**: Migration 002 (events and zones tables must exist)

---

### 006_clean_setup.sql
**Purpose**: Alternative clean setup - creates all tables from scratch

**What it does**:
- Drops all existing tables (if they exist)
- Recreates all tables with proper structure
- Creates indexes
- Enables RLS
- Creates simple RLS policies
- Creates storage bucket

**Use case**: 
- If you want to start fresh
- If migrations got corrupted
- For clean development environment

**Status**: ✅ Safe to run (but destructive)
**Dependencies**: None
**Warning**: Drops all existing data!

---

### 007_populate_staff_agents.sql
**Purpose**: Link auth users to staff_agents table

**What it does**:
- Contains template SQL for inserting staff agents
- Links Supabase Auth users to staff_agents table
- **Must be customized** with actual auth user UUIDs

**How to use**:
1. Create auth users in Supabase dashboard
2. Copy their UUIDs
3. Replace placeholder UUIDs in this migration
4. Run the migration

**Status**: ⚠️ Requires customization before running
**Dependencies**: Migration 004 (staff_agents table must exist)

---

## Recommended Migration Order

```
1. 001_create_staff_agents.sql
   ↓
2. 002_create_vehicle_registration.sql
   ↓
3. 004_fix_staff_agents_schema.sql
   ↓
4. 005_seed_events_and_zones.sql
   ↓
5. [Create auth users in Supabase dashboard]
   ↓
6. 007_populate_staff_agents.sql
```

**Skip**: Migration 003 (reference only) and 006 (alternative setup)

---

## Step-by-Step Setup

### Step 1: Run Initial Migrations
```bash
# Run migrations 001, 002, 004, 005 in order
supabase migration up
```

### Step 2: Create Auth Users
1. Go to Supabase Dashboard
2. Authentication > Users > Add user
3. Create 4 users with provided credentials
4. Copy each user's UUID

### Step 3: Populate Staff Agents
1. Edit migration 007 with actual UUIDs
2. Run migration 007
3. Verify staff_agents table is populated

### Step 4: Test
1. Go to `/staff/login`
2. Test login with each staff account
3. Verify redirect to correct dashboard

---

## Database Relationships

```
auth.users (Supabase Auth)
    ↓
    └─→ staff_agents (id = auth.users.id)

events
    ├─→ zones (event_id)
    └─→ vehicles (event_id)
        └─→ registration_tickets (vehicle_id)
            └─→ registration_tickets (event_id)
```

---

## Key Points

1. **Auth Users First**: Create auth users in Supabase dashboard before linking to staff_agents
2. **UUID Matching**: staff_agents.id must match auth.users.id
3. **Migration Order**: Run migrations in recommended order
4. **RLS Policies**: All tables have RLS enabled for security
5. **Storage Buckets**: Two buckets created (staff-documents, vehicle-images)

---

## Troubleshooting

### Migration fails with "table already exists"
- Use `IF NOT EXISTS` clause (already in migrations)
- Or drop table first: `DROP TABLE IF EXISTS table_name CASCADE;`

### "Foreign key constraint" error
- Ensure referenced table exists
- Run migrations in correct order
- Check foreign key references

### "Column does not exist" error
- Verify migration ran successfully
- Check table structure: `\d table_name`
- Re-run migration if needed

### Auth user not found in staff_agents
- Verify auth user was created in Supabase dashboard
- Check UUID matches exactly
- Run migration 007 with correct UUIDs

---

## Files Reference

- `README.md` - Main setup guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `STAFF_CREDENTIALS.md` - Staff account credentials
- `STAFF_SETUP_INSTRUCTIONS.md` - Original setup instructions
- `MIGRATION_SUMMARY.md` - This file
