# Debug Staff Login 401 Error

## Problem
Getting 401 (Unauthorized) when trying to log in with:
- Email: `registration@carflex.com`
- Password: `Registration@Carflex123`

## Possible Causes

1. **Wrong password** - The password in Supabase doesn't match what you're using
2. **Auth user not confirmed** - The email might not be verified
3. **Auth user doesn't exist** - Despite showing in the Users list
4. **Supabase client not configured** - Connection issue

## Solution

### Step 1: Verify Auth User Exists

Go to Supabase Dashboard > Authentication > Users

Check if `registration@carflex.com` is listed. If yes, continue to Step 2.

### Step 2: Reset the Password

1. In Supabase Users list, find `registration@carflex.com`
2. Click on the user
3. Click **Reset password** button
4. Set a new password: `Registration@Carflex123`
5. Confirm

### Step 3: Test Login Again

Try logging in with:
- Email: `registration@carflex.com`
- Password: `Registration@Carflex123`

### Step 4: Check Browser Console

If still getting 401:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Go to **Network** tab
5. Click on the `/api/staff/auth/login` request
6. Check the Response tab for the error message

## Alternative: Use Different Credentials

If the above doesn't work, try one of the other staff agents:

```
Email: gate@carflex.com
Password: Gate@Carflex123

Email: ground@carflex.com
Password: Ground@Carflex123

Email: exit@carflex.com
Password: Exit@Carflex123
```

## If None Work

The auth users might not have been created with passwords. You may need to:

1. Delete the existing auth users
2. Create new ones with passwords set
3. Update the staff_agents table with new UUIDs

Or contact Supabase support if there's an issue with the auth system.
