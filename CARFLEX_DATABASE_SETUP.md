# Carflex Database Setup - Complete Guide

This is the master setup guide for the Carflex vehicle registration system database.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Supabase project created
- `.env.local` configured with Supabase credentials
- Access to Supabase dashboard

### Step 1: Run Migrations
```bash
# Using Supabase CLI
supabase migration up

# Or manually in Supabase SQL Editor:
# Copy and paste migrations 001, 002, 004, 005 in order
```

### Step 2: Create Auth Users (Supabase Dashboard)
1. Go to **Authentication > Users**
2. Click **Add user** and create these 4 users:

| Email | Password |
|-------|----------|
| registration@carflex.com | Registration@Carflex123 |
| gate@carflex.com | Gate@Carflex123 |
| ground@carflex.com | Ground@Carflex123 |
| exit@carflex.com | Exit@Carflex123 |

**Copy each user's UUID after creation!**

### Step 3: Link Auth Users to Staff Agents
Run this SQL in Supabase SQL Editor (replace UUIDs):

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('PASTE_UUID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('PASTE_UUID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('PASTE_UUID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('PASTE_UUID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

### Step 4: Test Login
1. Go to `http://localhost:3000/staff/login`
2. Select staff type from dropdown
3. Enter email and password
4. Click "INITIATE ACCESS"

✅ **Done!** You should be redirected to the staff dashboard.

---

## 📋 Detailed Setup

### What Gets Created

#### Tables
- `staff_agents` - Staff member accounts
- `vehicles` - Vehicle registration records
- `events` - Event records
- `zones` - Parking zones
- `registration_tickets` - Generated tickets
- `admin_logs` - Audit trail

#### Storage Buckets
- `staff-documents` (private) - Staff document uploads
- `vehicle-images` (public) - Vehicle images

#### Indexes
- Email, type, event_id, vehicle_id, ticket_id, issued_at

#### RLS Policies
- All tables have Row Level Security enabled
- Policies allow appropriate access for staff and public

### Migration Files

| File | Purpose | Status |
|------|---------|--------|
| 001_create_staff_agents.sql | Storage buckets | ✅ Run |
| 002_create_vehicle_registration.sql | Main tables | ✅ Run |
| 003_seed_staff_agents.sql | Reference only | ⚠️ Skip |
| 004_fix_staff_agents_schema.sql | Staff table | ✅ Run |
| 005_seed_events_and_zones.sql | Sample data | ✅ Run |
| 006_clean_setup.sql | Alternative setup | ⚠️ Optional |
| 007_populate_staff_agents.sql | Link auth users | ✅ Run (after customizing) |

---

## 👥 Staff Accounts

### Account Types

1. **Registration Agent**
   - Email: registration@carflex.com
   - Password: Registration@Carflex123
   - Dashboard: `/staff/registration`
   - Role: Register vehicles, generate tickets

2. **Gate Verification Agent**
   - Email: gate@carflex.com
   - Password: Gate@Carflex123
   - Dashboard: `/staff/gate`
   - Role: Approve vehicles, view QR codes

3. **Ground Verification Agent**
   - Email: ground@carflex.com
   - Password: Ground@Carflex123
   - Dashboard: `/staff/ground`
   - Role: Scan QR codes, verify vehicles

4. **Exit Command Agent**
   - Email: exit@carflex.com
   - Password: Exit@Carflex123
   - Dashboard: `/staff/exit`
   - Role: Authorize vehicle departure

### Workflow

```
Vehicle Owner
    ↓
Registration Agent (registers vehicle, generates ticket)
    ↓
Gate Verification Agent (approves vehicle)
    ↓
Ground Verification Agent (scans QR code, verifies)
    ↓
Exit Command Agent (authorizes departure)
```

---

## 🔑 Key Concepts

### Auth Users vs Staff Agents

**Auth Users** (Supabase Auth):
- Created in Supabase dashboard
- Handles authentication (email/password)
- Stored in `auth.users` table
- Has UUID

**Staff Agents** (Our database):
- Stores staff information
- Links to auth users via UUID
- Stores staff type, name, last login
- Stored in `staff_agents` table

**Connection**: `staff_agents.id = auth.users.id`

### Tickets

- Generated when vehicle is registered
- Linked to specific event
- Has QR code for scanning
- Tracks issue time (`issued_at`)
- Can be marked as used (`used_at`)
- Can expire (`expires_at`)

### Events and Zones

- Events are vehicle registration events
- Zones are parking areas within events
- Vehicles are assigned to zones
- Tickets are issued for specific events

---

## 🛠️ Troubleshooting

### Login Issues

**"Invalid credentials"**
- Check email and password are correct
- Verify user exists in Supabase Authentication
- Ensure user is not disabled

**"Staff record not found"**
- Verify auth user UUID matches staff_agents.id
- Run the INSERT statement from Step 3 above
- Check email matches exactly

**"Dropdown not showing"**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

### Database Issues

**"Table already exists"**
- Migrations use `IF NOT EXISTS` - safe to re-run
- Or drop table: `DROP TABLE IF EXISTS table_name CASCADE;`

**"Foreign key constraint error"**
- Ensure referenced table exists
- Run migrations in correct order
- Check foreign key references

**"Column does not exist"**
- Verify migration ran successfully
- Check table structure: `\d table_name`
- Re-run migration if needed

---

## 📚 Documentation Files

Located in `supabase/` directory:

- `README.md` - Main setup guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `STAFF_CREDENTIALS.md` - Staff account information
- `MIGRATION_SUMMARY.md` - Migration file descriptions
- `STAFF_SETUP_INSTRUCTIONS.md` - Original setup instructions

---

## 🔐 Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies control who can access what
- Staff can only access their own data (configurable)

### Storage Buckets
- `staff-documents` - Private, only staff can access
- `vehicle-images` - Public, anyone can view

### Auth
- Passwords stored securely in Supabase Auth
- Can be changed in admin panel (`/admin/staff`)
- Session tokens used for API access

---

## 📊 Database Schema

### staff_agents
```sql
id UUID PRIMARY KEY              -- Matches auth.users.id
email TEXT NOT NULL UNIQUE       -- Staff email
name TEXT NOT NULL               -- Staff name
type TEXT NOT NULL               -- REGISTRATION_AGENT, etc.
last_login TIMESTAMP             -- Last login time
created_at TIMESTAMP             -- Creation time
updated_at TIMESTAMP             -- Last update time
```

### vehicles
```sql
id UUID PRIMARY KEY
owner_id UUID                    -- Reference to auth.users
reg_number TEXT NOT NULL UNIQUE  -- Registration number
event_id UUID                    -- Reference to events
zone_id UUID                     -- Reference to zones
status TEXT                      -- draft, active, sold, in_garage
is_verified BOOLEAN              -- Verification status
is_complete BOOLEAN              -- Completion status
-- ... other fields
```

### events
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL UNIQUE        -- Event name
location TEXT                    -- Event location
start_date TIMESTAMP             -- Start date
end_date TIMESTAMP               -- End date
is_active BOOLEAN                -- Active status
```

### zones
```sql
id UUID PRIMARY KEY
event_id UUID                    -- Reference to events
name TEXT NOT NULL               -- Zone name
capacity INTEGER                 -- Zone capacity
occupancy INTEGER                -- Current occupancy
price FLOAT                      -- Zone price
UNIQUE(event_id, name)           -- Unique per event
```

### registration_tickets
```sql
id UUID PRIMARY KEY
ticket_id TEXT NOT NULL UNIQUE   -- Unique ticket ID
vehicle_id UUID NOT NULL         -- Reference to vehicles
event_id UUID NOT NULL           -- Reference to events
status TEXT                      -- active, used, expired
issued_at TIMESTAMP              -- Issue time
expires_at TIMESTAMP             -- Expiration time
used_at TIMESTAMP                -- Usage time
-- ... other fields
```

---

## 🚀 Next Steps

1. ✅ Run migrations
2. ✅ Create auth users
3. ✅ Link auth users to staff agents
4. ✅ Test login
5. 📝 Create events and zones
6. 🚗 Register vehicles
7. 🎫 Generate tickets
8. 👥 Use staff dashboards

---

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Review documentation files in `supabase/`
3. Check Supabase dashboard for errors
4. Review browser console for client-side errors

---

## 📝 Notes

- All timestamps are in UTC (TIMESTAMP WITH TIME ZONE)
- UUIDs are used for all primary keys
- Passwords are managed by Supabase Auth
- All tables have audit timestamps (created_at, updated_at)
- RLS policies are configured for security
- Storage buckets are set up for documents and images

---

**Last Updated**: May 9, 2026
**Version**: 1.0
**Status**: Ready for production
