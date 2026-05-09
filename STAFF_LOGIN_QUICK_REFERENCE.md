# Staff Login - Quick Reference Card

## 🚨 Problem
Getting **401 Unauthorized** error on staff login

## ✅ Solution (Pick One)

### 1️⃣ Automatic (Fastest - 2 minutes)
```bash
export SUPABASE_URL="your_url"
export SUPABASE_SERVICE_ROLE_KEY="your_key"
npx ts-node scripts/setup-staff-agents.ts
```

### 2️⃣ Manual Dashboard (5 minutes)
1. Go to Supabase > Authentication > Users
2. Add 4 users with these emails:
   - `registration@carflex.com`
   - `gate@carflex.com`
   - `ground@carflex.com`
   - `exit@carflex.com`
3. Copy their UUIDs
4. Go to SQL Editor and run:
```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('UUID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('UUID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

### 3️⃣ Migration File (5 minutes)
1. Update `supabase/migrations/007_populate_staff_agents.sql` with actual UUIDs
2. Run: `supabase db push`

## 🔐 Test Credentials

| Email | Password |
|-------|----------|
| registration@carflex.com | Registration@Carflex123 |
| gate@carflex.com | Gate@Carflex123 |
| ground@carflex.com | Ground@Carflex123 |
| exit@carflex.com | Exit@Carflex123 |

## 🧪 Verify Setup

```sql
SELECT 
  sa.email,
  sa.name,
  sa.type,
  CASE WHEN au.id IS NOT NULL THEN 'Linked ✓' ELSE 'Not Linked ✗' END as status
FROM staff_agents sa
LEFT JOIN auth.users au ON sa.id = au.id;
```

Should show 4 rows with "Linked ✓"

## 🌐 Test Login
Go to: `http://localhost:3000/staff/login`

## 📚 Need Help?
- **Setup**: See `STAFF_SETUP_GUIDE.md`
- **Troubleshooting**: See `STAFF_LOGIN_TROUBLESHOOTING.md`
- **Overview**: See `FIX_SUMMARY.md`

## ⚡ Common Issues

| Issue | Fix |
|-------|-----|
| Still 401 after setup | Clear browser cache (Ctrl+Shift+Delete) |
| "Staff record not found" | UUIDs don't match - verify with SQL query |
| "Invalid credentials" | Check email/password are exact match |
| "COMMUNICATION_ERROR" | Dev server not running or API down |

## 🎯 Expected Redirects After Login

- REGISTRATION_AGENT → `/staff/registration`
- GATE_VERIFICATION_AGENT → `/staff/gate`
- GROUND_VERIFICATION_AGENT → `/staff/ground`
- EXIT_COMMAND_AGENT → `/staff/exit`

## 📋 Checklist

- [ ] Auth users created in Supabase
- [ ] staff_agents table populated
- [ ] Verified with SQL query
- [ ] Browser cache cleared
- [ ] Login tested successfully
- [ ] Redirected to correct page

---

**Status**: ✅ Ready to use  
**Setup Time**: 2-5 minutes  
**Difficulty**: Easy
