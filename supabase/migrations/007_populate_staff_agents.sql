-- Populate staff_agents table with auth user IDs
-- Auth users created in Supabase dashboard

INSERT INTO staff_agents (id, email, name, type, created_at, updated_at)
VALUES
  ('8f224723-5d83-4f5b-bdfc-396934565d67', 'registration@carflex.com', 'Registration Agent', 'REGISTRATION_AGENT', NOW(), NOW()),
  ('b0321332-9774-427a-a37b-722addc58a2b', 'gate@carflex.com', 'Gate Verification Agent', 'GATE_VERIFICATION_AGENT', NOW(), NOW()),
  ('952e7b80-e0e6-4bd2-9045-d5bd843f37fe', 'ground@carflex.com', 'Ground Verification Agent', 'GROUND_VERIFICATION_AGENT', NOW(), NOW()),
  ('79255080-4f3a-4921-a883-7e3351ff09f0', 'exit@carflex.com', 'Exit Command Agent', 'EXIT_COMMAND_AGENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
