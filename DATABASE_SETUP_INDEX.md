# Database Setup Documentation Index

## 📖 Start Here

**New to the setup?** Start with one of these:

1. **[CARFLEX_DATABASE_SETUP.md](./CARFLEX_DATABASE_SETUP.md)** ⭐ **START HERE**
   - Complete master guide
   - Quick start (5 minutes)
   - Detailed setup
   - Troubleshooting
   - All in one place

2. **[supabase/README.md](./supabase/README.md)**
   - Supabase-specific setup
   - Migration order
   - Database schema
   - API endpoints

## 📚 Detailed Guides

### Setup Instructions
- **[supabase/SETUP_GUIDE.md](./supabase/SETUP_GUIDE.md)**
  - Step-by-step setup
  - Database schema details
  - Storage buckets
  - Troubleshooting

### Staff Credentials
- **[supabase/STAFF_CREDENTIALS.md](./supabase/STAFF_CREDENTIALS.md)**
  - Staff account information
  - Default passwords
  - How to create auth users
  - How to link auth users to staff_agents
  - Testing login

### Migration Details
- **[supabase/MIGRATION_SUMMARY.md](./supabase/MIGRATION_SUMMARY.md)**
  - What each migration does
  - Migration order
  - Dependencies
  - Troubleshooting

### Original Setup
- **[supabase/STAFF_SETUP_INSTRUCTIONS.md](./supabase/STAFF_SETUP_INSTRUCTIONS.md)**
  - Original setup instructions
  - Reference document

## 🗂️ Migration Files

Located in `supabase/migrations/`:

| File | Purpose | Run? |
|------|---------|------|
| 001_create_staff_agents.sql | Storage buckets | ✅ Yes |
| 002_create_vehicle_registration.sql | Main tables | ✅ Yes |
| 003_seed_staff_agents.sql | Reference only | ⚠️ No |
| 004_fix_staff_agents_schema.sql | Staff table | ✅ Yes |
| 005_seed_events_and_zones.sql | Sample data | ✅ Yes |
| 006_clean_setup.sql | Alternative setup | ⚠️ Optional |
| 007_populate_staff_agents.sql | Link auth users | ✅ Yes (after customizing) |

## 🚀 Quick Setup Checklist

- [ ] Read CARFLEX_DATABASE_SETUP.md
- [ ] Run migrations 001, 002, 004, 005
- [ ] Create 4 auth users in Supabase dashboard
- [ ] Copy auth user UUIDs
- [ ] Run migration 007 with actual UUIDs
- [ ] Test login at `/staff/login`
- [ ] Verify redirect to correct dashboard

## 👥 Staff Accounts

| Email | Password | Type | Dashboard |
|-------|----------|------|-----------|
| registration@carflex.com | Registration@Carflex123 | REGISTRATION_AGENT | `/staff/registration` |
| gate@carflex.com | Gate@Carflex123 | GATE_VERIFICATION_AGENT | `/staff/gate` |
| ground@carflex.com | Ground@Carflex123 | GROUND_VERIFICATION_AGENT | `/staff/ground` |
| exit@carflex.com | Exit@Carflex123 | EXIT_COMMAND_AGENT | `/staff/exit` |

## 🔑 Key Concepts

### Auth Users vs Staff Agents
- **Auth Users**: Created in Supabase dashboard, handles authentication
- **Staff Agents**: Our database table, stores staff information
- **Connection**: `staff_agents.id = auth.users.id`

### Workflow
```
Vehicle Owner
    ↓
Registration Agent (register vehicle, generate ticket)
    ↓
Gate Verification Agent (approve vehicle)
    ↓
Ground Verification Agent (scan QR code, verify)
    ↓
Exit Command Agent (authorize departure)
```

## 📊 Database Tables

- `staff_agents` - Staff member accounts
- `vehicles` - Vehicle registration records
- `events` - Event records
- `zones` - Parking zones
- `registration_tickets` - Generated tickets
- `admin_logs` - Audit trail

## 💾 Storage Buckets

- `staff-documents` (private) - Staff document uploads
- `vehicle-images` (public) - Vehicle images

## 🆘 Common Issues

### "Staff record not found"
→ See [supabase/STAFF_CREDENTIALS.md](./supabase/STAFF_CREDENTIALS.md) - "Troubleshooting" section

### "Invalid credentials"
→ See [supabase/STAFF_CREDENTIALS.md](./supabase/STAFF_CREDENTIALS.md) - "Troubleshooting" section

### Migration errors
→ See [supabase/MIGRATION_SUMMARY.md](./supabase/MIGRATION_SUMMARY.md) - "Troubleshooting" section

### Database errors
→ See [supabase/SETUP_GUIDE.md](./supabase/SETUP_GUIDE.md) - "Troubleshooting" section

## 📞 Need Help?

1. **Quick answer?** → Check CARFLEX_DATABASE_SETUP.md troubleshooting
2. **Setup question?** → Check supabase/SETUP_GUIDE.md
3. **Staff credentials?** → Check supabase/STAFF_CREDENTIALS.md
4. **Migration details?** → Check supabase/MIGRATION_SUMMARY.md
5. **Still stuck?** → Check browser console and Supabase dashboard logs

## 📝 File Structure

```
.
├── CARFLEX_DATABASE_SETUP.md          ⭐ START HERE
├── DATABASE_SETUP_INDEX.md            (this file)
└── supabase/
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── STAFF_CREDENTIALS.md
    ├── MIGRATION_SUMMARY.md
    ├── STAFF_SETUP_INSTRUCTIONS.md
    └── migrations/
        ├── 001_create_staff_agents.sql
        ├── 002_create_vehicle_registration.sql
        ├── 003_seed_staff_agents.sql
        ├── 004_fix_staff_agents_schema.sql
        ├── 005_seed_events_and_zones.sql
        ├── 006_clean_setup.sql
        └── 007_populate_staff_agents.sql
```

## ✅ Status

- ✅ All migrations created
- ✅ All documentation written
- ✅ Staff credentials documented
- ✅ Troubleshooting guides included
- ✅ Ready for setup

## 🎯 Next Steps

1. Open [CARFLEX_DATABASE_SETUP.md](./CARFLEX_DATABASE_SETUP.md)
2. Follow the "Quick Start" section
3. Test login at `/staff/login`
4. Start using the staff dashboards

---

**Last Updated**: May 9, 2026
**Version**: 1.0
**Status**: Complete and ready for use
