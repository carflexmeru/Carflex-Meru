# Staff Login 401 Error - Troubleshooting Guide

## Problem
You're seeing a **401 Unauthorized** error when trying to log in to the staff terminal.

## Root Cause
The staff_agents table is empty because:
1. No auth users have been created in Supabase
2. The staff_agents table hasn't been populated with user IDs

## Quick Fix (5 minutes)

### Option 1: Automatic Setup (Recommended)

If you have Node.js and the Supabase CLI installed:

```bash
# Set environment variables
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the setup script
npx ts-node scripts/setup-staff-agents.ts
```

### Option 2: Manual Setup via Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to **Authentication > Users**

2. **Create 4 Auth Users**
   
   Click **Add user** for each:

   ```
   User 1:
   - Email: registration@carflex.com
   - Password: Registration@Carflex123
   
   User 2:
   - Email: gate@carflex.com
   - Password: Gate@Carflex123
   
   User 3:
   - Email: ground@carflex.com
   - Password: Ground@Carflex123
   
   User 4:
   - Email: exit@carflex.com
   - Password: Exit@Carflex123
   ```

3. **Copy User IDs**
   - After creating each user, copy their UUID
   - You'll need these for the next step

4. **Update Migration File**
   - Open `supabase/migrations/007_populate_staff_agents.sql`
   - Replace the placeholder UUIDs with actual ones:
   
   ```sql
   INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
   VALUES
     ('ACTUAL_UUID_1', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
     ('ACTUAL_UUID_2', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
     ('ACTUAL_UUID_3', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
     ('ACTUAL_UUID_4', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
   ON CONFLICT (id) DO NOTHING;
   ```

5. **Run Migration**
   - Go to **SQL Editor** in Supabase
   - Paste the updated query
   - Click **Run**

6. **Test Login**
   - Go to `http://localhost:3000/staff/login`
   - Try logging in with one of the credentials above

## Verification Checklist

- [ ] Auth users created in Supabase (Authentication > Users)
- [ ] staff_agents table populated (check with SQL query below)
- [ ] Email addresses match exactly
- [ ] Passwords are correct
- [ ] Browser cache cleared (Ctrl+Shift+Delete)

### Verify Setup with SQL

Run this query in Supabase SQL Editor:

```sql
-- Check auth users
SELECT id, email FROM auth.users WHERE email LIKE '%carflex.com%';

-- Check staff_agents
SELECT id, email, name, type FROM staff_agents;

-- Check if they match
SELECT 
  sa.email,
  sa.name,
  sa.type,
  CASE WHEN au.id IS NOT NULL THEN 'Linked ✓' ELSE 'Not Linked ✗' END as status
FROM staff_agents sa
LEFT JOIN auth.users au ON sa.id = au.id;
```

## Common Issues & Solutions

### Issue 1: Still Getting 401 After Setup

**Cause**: Auth user exists but staff_agents table not populated

**Solution**:
1. Verify staff_agents table has data:
   ```sql
   SELECT COUNT(*) FROM staff_agents;
   ```
2. If count is 0, run the INSERT query from Step 4 above
3. Clear browser cache and try again

### Issue 2: "Staff record not found" Error

**Cause**: Auth user exists but UUID doesn't match staff_agents.id

**Solution**:
1. Get the auth user UUID:
   ```sql
   SELECT id FROM auth.users WHERE email = 'registration@carflex.com';
   ```
2. Check if it exists in staff_agents:
   ```sql
   SELECT * FROM staff_agents WHERE id = 'THE_UUID_FROM_ABOVE';
   ```
3. If not found, insert it:
   ```sql
   INSERT INTO staff_agents (id, email, name, type)
   VALUES ('THE_UUID', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT');
   ```

### Issue 3: "Invalid credentials" Error

**Cause**: Wrong email or password

**Solution**:
1. Verify the email is correct (case-sensitive)
2. Verify the password is correct (case-sensitive)
3. Check that you're using the exact credentials from the setup
4. Try resetting the password in Supabase dashboard

### Issue 4: "COMMUNICATION_ERROR: LINK SEVERED"

**Cause**: Network error or API not responding

**Solution**:
1. Check if the development server is running
2. Check browser console for detailed error
3. Verify API endpoint exists: `GET /api/staff/auth/login`
4. Check Supabase connection is working

### Issue 5: Browser Shows "login1" in Error

**Cause**: Browser cache issue or URL typo

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Close and reopen browser
3. Try in incognito/private mode
4. Check the actual fetch URL in Network tab

## Debug Steps

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Copy the full error and search for it

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to log in
4. Look for the `/api/staff/auth/login` request
5. Click on it and check:
   - Status code (should be 200 for success, 401 for auth failure)
   - Request body (email and password)
   - Response body (error message)

### Step 3: Check Supabase Logs
1. Go to Supabase dashboard
2. Navigate to **Logs** section
3. Look for authentication errors
4. Check API logs for failed requests

### Step 4: Verify Database Connection
1. Go to Supabase SQL Editor
2. Run: `SELECT NOW();`
3. If it works, database is connected
4. Run: `SELECT * FROM staff_agents LIMIT 1;`
5. If it returns data, table is populated

## Testing Credentials

After setup, use these to test:

| Agent Type | Email | Password |
|---|---|---|
| REGISTRATION_AGENT | registration@carflex.com | Registration@Carflex123 |
| GATE_VERIFICATION_AGENT | gate@carflex.com | Gate@Carflex123 |
| GROUND_VERIFICATION_AGENT | ground@carflex.com | Ground@Carflex123 |
| EXIT_COMMAND_AGENT | exit@carflex.com | Exit@Carflex123 |

## Expected Behavior After Login

After successful login, you should be redirected to:
- REGISTRATION_AGENT → `/staff/registration`
- GATE_VERIFICATION_AGENT → `/staff/gate`
- GROUND_VERIFICATION_AGENT → `/staff/ground`
- EXIT_COMMAND_AGENT → `/staff/exit`

## Still Having Issues?

1. **Check STAFF_SETUP_GUIDE.md** for detailed setup instructions
2. **Review the API code** at `src/app/api/staff/auth/login/route.ts`
3. **Check Supabase documentation** for auth setup
4. **Enable debug logging** in the API route
5. **Contact support** with:
   - Error message from console
   - Network tab screenshot
   - Supabase logs
   - Steps you've already tried

## Security Notes

- These are test credentials for development only
- Change passwords before deploying to production
- Use strong, unique passwords in production
- Consider using environment variables for credentials
- Enable 2FA for production accounts
- Never commit credentials to version control

## Related Files

- `STAFF_SETUP_GUIDE.md` - Detailed setup instructions
- `src/app/staff/login/page.tsx` - Login page component
- `src/app/api/staff/auth/login/route.ts` - Login API endpoint
- `supabase/migrations/004_fix_staff_agents_schema.sql` - Table schema
- `supabase/migrations/007_populate_staff_agents.sql` - Data population
- `scripts/setup-staff-agents.ts` - Automated setup script
