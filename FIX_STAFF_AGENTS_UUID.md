# Fix Staff Agents - Update with Correct UUIDs

## Problem
The staff_agents table has records but they have NULL UUIDs (no id). They need to be updated with the actual auth user IDs.

## Solution

Run this SQL query in Supabase SQL Editor:

```sql
-- Update staff_agents with correct auth user IDs
UPDATE staff_agents SET id = '8f224723-5d83-4f5b-bdfc-396934565d67' WHERE email = 'registration@carflex.com';
UPDATE staff_agents SET id = 'b0321332-9774-427a-a37b-722addc58a2b' WHERE email = 'gate@carflex.com';
UPDATE staff_agents SET id = '952e7b80-e0e6-4bd2-9045-d5bd843f37fe' WHERE email = 'ground@carflex.com';
UPDATE staff_agents SET id = '79255080-4f3a-4921-a883-7e3351ff09f0' WHERE email = 'exit@carflex.com';
```

## Verify It Worked

After running the updates, verify with:

```sql
SELECT id, email, name, type FROM staff_agents;
```

You should see 4 rows with UUIDs in the id column.

## Test Login

Now go to: `http://localhost:3000/staff/login`

Use these credentials:
- Email: `registration@carflex.com`
- Password: `Registration@Carflex123`
- Agent Type: `REGISTRATION_AGENT`

Click **INITIATE ACCESS** and you should be logged in!

## If You Get an Error

If you get "duplicate key value violates unique constraint":
- This means the id is already set
- Run the SELECT query above to check current state
- If all have UUIDs, you're good to go!

If you get "null value in column "id" violates not-null constraint":
- The id column is required
- Make sure you're running the UPDATE queries above
