# Vercel Environment Variables Setup

## Problem
The Supabase credentials are not set in Vercel, causing "fetch failed" errors.

## Solution

### Step 1: Get Your Supabase Credentials

From `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL="https://ikrlxhqddvkttdffswps.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_YqG0ZQ1_8pUay2iRmjOjNw_nVZwkh_k"
```

### Step 2: Add to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project (carflex-meru)
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://ikrlxhqddvkttdffswps.supabase.co`
- Environments: Production, Preview, Development

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Value: `sb_publishable_YqG0ZQ1_8pUay2iRmjOjNw_nVZwkh_k`
- Environments: Production, Preview, Development

### Step 3: Redeploy

1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Test

Go to `https://carflex-meru.vercel.app/staff/login` and try logging in again.

## Credentials to Use

- **Email**: `registration@carflex.com`
- **Password**: `Registration@123`

## If Still Not Working

1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private mode
3. Check Vercel deployment logs for errors
4. Verify environment variables were saved correctly

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

These are the only ones needed for staff login to work.
