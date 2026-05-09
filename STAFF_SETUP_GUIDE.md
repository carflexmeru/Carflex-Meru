# Staff Authentication Setup Guide

## Problem
The staff login is returning a 401 error because no auth users have been created in Supabase.

## Solution

### Step 1: Create Auth Users in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user** and create the following users:

#### User 1: Registration Agent
- **Email**: `registration@carflex.com`
- **Password**: `Registration@Carflex123`
- **Confirm Password**: `Registration@Carflex123`
- Click **Save**
- **Copy the UUID** (you'll need this)

#### User 2: Gate Verification Agent
- **Email**: `gate@carflex.com`
- **Password**: `Gate@Carflex123`
- **Confirm Password**: `Gate@Carflex123`
- Click **Save**
- **Copy the UUID**

#### User 3: Ground Verification Agent
- **Email**: `ground@carflex.com`
- **Password**: `Ground@Carflex123`
- **Confirm Password**: `Ground@Carflex123`
- Click **Save**
- **Copy the UUID**

#### User 4: Exit Command Agent
- **Email**: `exit@carflex.com`
- **Password**: `Exit@Carflex123`
- **Confirm Password**: `Exit@Carflex123`
- Click **Save**
- **Copy the UUID**

### Step 2: Populate staff_agents Table

After creating the auth users, you need to link them to the staff_agents table.

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Replace the UUIDs in the query below with the actual UUIDs from Step 1
4. Run the query

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('UUID_1_HERE', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('UUID_2_HERE', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_3_HERE', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('UUID_4_HERE', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

#### Option B: Using Migration File

1. Update `supabase/migrations/007_populate_staff_agents.sql` with the actual UUIDs
2. Run the migration using Supabase CLI:
   ```bash
   supabase db push
   ```

### Step 3: Test the Login

1. Go to `http://localhost:3000/staff/login`
2. Select an agent type from the dropdown
3. Enter the email and password for that agent
4. Click **INITIATE ACCESS**

#### Test Credentials

| Agent Type | Email | Password |
|---|---|---|
| REGISTRATION_AGENT | registration@carflex.com | Registration@Carflex123 |
| GATE_VERIFICATION_AGENT | gate@carflex.com | Gate@Carflex123 |
| GROUND_VERIFICATION_AGENT | ground@carflex.com | Ground@Carflex123 |
| EXIT_COMMAND_AGENT | exit@carflex.com | Exit@Carflex123 |

## Troubleshooting

### Still Getting 401 Error?

1. **Verify auth users exist**
   - Go to Supabase dashboard > Authentication > Users
   - Confirm all 4 users are listed

2. **Verify staff_agents table is populated**
   - Go to Supabase dashboard > SQL Editor
   - Run: `SELECT * FROM staff_agents;`
   - Should show 4 rows

3. **Check email matches exactly**
   - Auth user email must match staff_agents email exactly
   - Case-sensitive

4. **Verify password is correct**
   - Make sure you're using the exact password you set
   - Passwords are case-sensitive

5. **Check browser console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab to see the API response

### Getting "Staff record not found" Error?

This means the auth user exists but isn't linked to staff_agents table.

**Solution**: Run the INSERT query from Step 2 with the correct UUIDs.

### Getting "Invalid credentials" Error?

This means the email/password combination is wrong.

**Solution**: 
- Double-check the email and password
- Make sure you're using the credentials from Step 1
- Verify the password hasn't been changed

## Next Steps

After successful login, staff agents can access:
- **REGISTRATION_AGENT**: `/staff/registration`
- **GATE_VERIFICATION_AGENT**: `/staff/gate`
- **GROUND_VERIFICATION_AGENT**: `/staff/ground`
- **EXIT_COMMAND_AGENT**: `/staff/exit`

## Security Notes

- These are test credentials for development only
- Change passwords before deploying to production
- Use strong, unique passwords in production
- Consider using environment variables for credentials
- Enable 2FA for production accounts

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify all UUIDs are correct
3. Ensure migrations have been run
4. Check Supabase project status
5. Review API logs in Supabase dashboard
