# Quick Reference Guide

## 🚀 5-Minute Setup

```bash
# 1. Run migrations
supabase migration up

# 2. Create auth users in Supabase dashboard
# (See credentials below)

# 3. Run migration 007 with actual UUIDs
# (See instructions below)

# 4. Test login
# Go to http://localhost:3000/staff/login
```

---

## 👥 Staff Credentials

Create these 4 users in Supabase Authentication:

```
1. registration@carflex.com / Registration@Carflex123
2. gate@carflex.com / Gate@Carflex123
3. ground@carflex.com / Ground@Carflex123
4. exit@carflex.com / Exit@Carflex123
```

**Copy each user's UUID after creation!**

---

## 🔗 Link Auth Users to Staff Agents

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('UUID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('UUID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

Replace `UUID_1`, `UUID_2`, etc. with actual auth user UUIDs.

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| staff_agents | Staff member accounts |
| vehicles | Vehicle registration records |
| events | Event records |
| zones | Parking zones |
| registration_tickets | Generated tickets |
| admin_logs | Audit trail |

---

## 🗂️ Migrations

| # | File | Purpose | Run? |
|---|------|---------|------|
| 1 | 001_create_staff_agents.sql | Storage buckets | ✅ |
| 2 | 002_create_vehicle_registration.sql | Main tables | ✅ |
| 3 | 003_seed_staff_agents.sql | Reference only | ⚠️ |
| 4 | 004_fix_staff_agents_schema.sql | Staff table | ✅ |
| 5 | 005_seed_events_and_zones.sql | Sample data | ✅ |
| 6 | 006_clean_setup.sql | Alternative setup | ⚠️ |
| 7 | 007_populate_staff_agents.sql | Link auth users | ✅ |

---

## 🎯 Staff Dashboards

| Email | Password | Dashboard |
|-------|----------|-----------|
| registration@carflex.com | Registration@Carflex123 | `/staff/registration` |
| gate@carflex.com | Gate@Carflex123 | `/staff/gate` |
| ground@carflex.com | Ground@Carflex123 | `/staff/ground` |
| exit@carflex.com | Exit@Carflex123 | `/staff/exit` |

---

## 🔍 Verify Setup

```sql
-- Check staff_agents
SELECT id, email, name, type FROM staff_agents;

-- Check vehicles
SELECT id, reg_number, status FROM vehicles;

-- Check events
SELECT id, name, is_active FROM events;

-- Check zones
SELECT id, name, capacity FROM zones;

-- Check tickets
SELECT id, ticket_id, status FROM registration_tickets;
```

---

## 🆘 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Staff record not found" | Run migration 007 with correct UUIDs |
| "Invalid credentials" | Check email/password, verify user exists |
| "Dropdown not showing" | Clear cache, hard refresh (Ctrl+Shift+R) |
| "Foreign key error" | Run migrations in order |
| "Column does not exist" | Verify migration ran successfully |

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| CARFLEX_DATABASE_SETUP.md | ⭐ Master guide |
| DATABASE_SETUP_INDEX.md | Documentation index |
| MIGRATION_ISSUES_FIXED.md | What was fixed |
| SETUP_COMPLETE.md | Completion summary |
| supabase/README.md | Supabase guide |
| supabase/SETUP_GUIDE.md | Detailed setup |
| supabase/STAFF_CREDENTIALS.md | Credentials |
| supabase/MIGRATION_SUMMARY.md | Migration details |

---

## 🔑 Key Concepts

**Auth Users**: Created in Supabase dashboard
**Staff Agents**: Database table linked to auth users
**Connection**: `staff_agents.id = auth.users.id`

---

## 📞 Need Help?

1. Check `CARFLEX_DATABASE_SETUP.md` troubleshooting
2. Check `supabase/STAFF_CREDENTIALS.md` for credentials
3. Check `supabase/MIGRATION_SUMMARY.md` for migration details
4. Check browser console for errors

---

## ✅ Setup Checklist

- [ ] Run migrations 001, 002, 004, 005
- [ ] Create 4 auth users in Supabase
- [ ] Copy auth user UUIDs
- [ ] Run migration 007 with UUIDs
- [ ] Test login at `/staff/login`
- [ ] Verify redirect to dashboard

---

**Last Updated**: May 9, 2026
**Version**: 1.0
