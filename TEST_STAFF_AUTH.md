# Test Staff Authentication

## Quick Diagnosis

The 401 error means Supabase is rejecting the credentials. Let's verify the setup:

### Step 1: Check Supabase Auth Users

Go to your Supabase dashboard:
1. Click **Authentication** > **Users**
2. Look for `registration@carflex.com`
3. Check if it's listed

### Step 2: Verify the Password

The password might not be what we think. Try these possibilities:

**Option A: Reset the Password**
1. In Supabase Users list, click on `registration@carflex.com`
2. Click **Reset password**
3. Set it to: `Registration@123`
4. Try logging in again

**Option B: Check What Password Was Set**
1. In Supabase Users list, click on `registration@carflex.com`
2. Look at the user details
3. Check if there's a password field or last sign-in info

**Option C: Try a Different Password**
If `Registration@123` doesn't work, try:
- `registration@123` (all lowercase)
- `REGISTRATION@123` (all uppercase)
- `Registration@Carflex123` (the original one we mentioned)

### Step 3: Check if Auth User is Confirmed

1. In Supabase Users list, click on `registration@carflex.com`
2. Look for an "Email confirmed" or "Verified" status
3. If not confirmed, click **Confirm email**

### Step 4: Verify staff_agents Table Link

Run this SQL in Supabase SQL Editor:

```sql
SELECT 
  sa.id,
  sa.email,
  sa.name,
  au.id as auth_id,
  au.email as auth_email
FROM staff_agents sa
LEFT JOIN auth.users au ON sa.id = au.id
WHERE sa.email = 'registration@carflex.com';
```

Should show:
- `sa.id` = UUID (not NULL)
- `au.id` = same UUID
- Both emails match

If `au.id` is NULL, the link is broken.

## Most Likely Issue

The password in Supabase doesn't match `Registration@123`. 

**Solution**: Reset it in Supabase dashboard and try again.

## If Still Not Working

1. Delete the auth user from Supabase
2. Create a new one with password: `Test@123`
3. Update staff_agents table with new UUID
4. Try logging in with `Test@123`

This will help us isolate if it's a password issue or a connection issue.
