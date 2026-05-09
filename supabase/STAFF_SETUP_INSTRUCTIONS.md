# Staff Account Setup Instructions

Since Supabase Auth users must be created through the Auth API or dashboard, follow these steps:

## Step 1: Create Auth Users in Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Authentication → Users**
3. Click **Add user** and create these accounts:

### Registration Agent
- **Email**: `registration@carflex.com`
- **Password**: `Registration@Carflex123`
- **Auto Confirm**: Check this box

### Gate Verification Agent
- **Email**: `gate@carflex.com`
- **Password**: `Gate@Carflex123`
- **Auto Confirm**: Check this box

### Ground Verification Agent
- **Email**: `ground@carflex.com`
- **Password**: `Ground@Carflex123`
- **Auto Confirm**: Check this box

### Exit Command Agent
- **Email**: `exit@carflex.com`
- **Password**: `Exit@Carflex123`
- **Auto Confirm**: Check this box

## Step 2: Get the User IDs

After creating each user, copy their UUID from the Users table.

## Step 3: Update the Migration

Update `supabase/migrations/003_seed_staff_agents.sql` with the actual UUIDs:

Replace these placeholder UUIDs:
```sql
'00000000-0000-0000-0000-000000000001'::uuid  -- Registration Agent
'00000000-0000-0000-0000-000000000002'::uuid  -- Gate Agent
'00000000-0000-0000-0000-000000000003'::uuid  -- Ground Agent
'00000000-0000-0000-0000-000000000004'::uuid  -- Exit Agent
```

With the actual UUIDs from your auth.users table.

## Step 4: Run the Migration

1. Go to Supabase SQL Editor
2. Copy the updated migration SQL
3. Execute it

## Alternative: Use the Registration API

You can also create staff accounts programmatically:

```bash
curl -X POST http://localhost:3000/api/staff/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "registration@carflex.com",
    "password": "Registration@Carflex123",
    "name": "Registration Agent",
    "type": "REGISTRATION_AGENT"
  }'
```

## Staff Login Credentials

Once set up, staff can login at `/staff/login` with:

| Role | Email | Password |
|------|-------|----------|
| Registration Agent | `registration@carflex.com` | `Registration@Carflex123` |
| Gate Verification Agent | `gate@carflex.com` | `Gate@Carflex123` |
| Ground Verification Agent | `ground@carflex.com` | `Ground@Carflex123` |
| Exit Command Agent | `exit@carflex.com` | `Exit@Carflex123` |

## Changing Passwords

Admins can change staff passwords via `/admin/staff` page or using the API:

```bash
POST /api/admin/staff/update-password
{
  "staffId": "user-uuid",
  "newPassword": "NewPassword@123"
}
```
