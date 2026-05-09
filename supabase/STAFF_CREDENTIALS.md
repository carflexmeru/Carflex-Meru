# Staff Credentials and Setup

## Default Staff Accounts

Create these accounts in Supabase Authentication > Users:

### 1. Registration Agent
- **Email**: registration@carflex.com
- **Password**: Registration@Carflex123
- **Type**: REGISTRATION_AGENT
- **Dashboard**: `/staff/registration`
- **Role**: Registers vehicles and generates tickets

### 2. Gate Verification Agent
- **Email**: gate@carflex.com
- **Password**: Gate@Carflex123
- **Type**: GATE_VERIFICATION_AGENT
- **Dashboard**: `/staff/gate`
- **Role**: Verifies vehicles at gate and approves them

### 3. Ground Verification Agent
- **Email**: ground@carflex.com
- **Password**: Ground@Carflex123
- **Type**: GROUND_VERIFICATION_AGENT
- **Dashboard**: `/staff/ground`
- **Role**: Verifies vehicles on ground using QR codes

### 4. Exit Command Agent
- **Email**: exit@carflex.com
- **Password**: Exit@Carflex123
- **Type**: EXIT_COMMAND_AGENT
- **Dashboard**: `/staff/exit`
- **Role**: Authorizes vehicle departure

## How to Create Auth Users

1. Go to Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user**
4. Enter email and password
5. Click **Create user**
6. Copy the user's UUID (shown in the user list)

## How to Link Auth Users to Staff Agents

After creating all auth users, run this SQL in Supabase SQL Editor:

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('PASTE_REGISTRATION_AGENT_UUID_HERE', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('PASTE_GATE_AGENT_UUID_HERE', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('PASTE_GROUND_AGENT_UUID_HERE', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('PASTE_EXIT_AGENT_UUID_HERE', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

## Workflow

1. **Registration Agent** registers vehicles and generates tickets
2. **Gate Verification Agent** approves pending vehicles
3. **Ground Verification Agent** scans QR codes to verify vehicles
4. **Exit Command Agent** authorizes vehicle departure

## Password Management

Passwords can be changed in the admin panel at `/admin/staff`.

## Testing Login

1. Go to `/staff/login`
2. Select staff type from dropdown
3. Enter email and password
4. Click "INITIATE ACCESS"
5. You should be redirected to the appropriate dashboard

## Troubleshooting

### Login fails with "Invalid credentials"
- Check email and password are correct
- Verify user exists in Supabase Authentication
- Ensure user is not disabled

### Login fails with "Staff record not found"
- Verify staff_agents table has entry for this user
- Check that the auth user ID matches the staff_agents.id
- Run the SQL INSERT command above to link auth user to staff_agents

### Can't see dropdown on login page
- Clear browser cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
