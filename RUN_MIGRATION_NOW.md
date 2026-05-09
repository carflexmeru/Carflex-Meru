# Run Migration Now - Staff Agents Population

## Quick Steps

1. **Go to Supabase SQL Editor**
   - Open your Supabase project dashboard
   - Click on **SQL Editor** in the left sidebar

2. **Create a New Query**
   - Click **New Query**
   - Paste the SQL below

3. **Run the Query**
   - Click **Run** button
   - You should see "1 row affected" or similar

## SQL Query to Run

```sql
INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('8f224723-5d83-4f5b-bdfc-396934565d67', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('b0321332-9774-427a-a37b-722addc58a2b', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('952e7b80-e0e6-4bd2-9045-d5bd843f37fe', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('79255080-4f3a-4921-a883-7e3351ff09f0', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
```

## Verify It Worked

After running, execute this query to verify:

```sql
SELECT id, email, name, type FROM staff_agents;
```

You should see 4 rows with the staff agents.

## Test Login

Now go to: `http://localhost:3000/staff/login`

Use these credentials:
- Email: `registration@carflex.com`
- Password: `Registration@Carflex123`
- Agent Type: `REGISTRATION_AGENT`

Click **INITIATE ACCESS** and you should be logged in!

## If It Still Doesn't Work

1. Clear browser cache (Ctrl+Shift+Delete)
2. Close and reopen the browser
3. Try again with the login

## Troubleshooting

If you get an error like "duplicate key value violates unique constraint":
- The records might already exist
- Run this to check: `SELECT COUNT(*) FROM staff_agents;`
- If count is 4, you're good to go!

If you get "relation does not exist":
- The table might not have been created
- Run the migration: `supabase/migrations/004_fix_staff_agents_schema.sql`
