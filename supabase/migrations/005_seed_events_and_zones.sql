-- Seed events
INSERT INTO events (name, location, start_date, end_date, is_active)
VALUES
  (
    'Meru Car Bazaar 2026',
    'Meru Showground',
    NOW(),
    NOW() + INTERVAL '7 days',
    TRUE
  ),
  (
    'Meru 10th Anniversary 2026',
    'Meru Showground',
    NOW(),
    NOW() + INTERVAL '7 days',
    TRUE
  )
ON CONFLICT (name) DO NOTHING;

-- Seed zones for the first event
INSERT INTO zones (event_id, name, capacity, price)
SELECT 
  e.id,
  zone_name,
  capacity,
  price
FROM events e
CROSS JOIN (
  VALUES
    ('Zone A - Premium Row', 50, 1500),
    ('Zone B - Standard Row', 80, 1000),
    ('Zone C - Motorcycles', 100, 500)
) AS zones(zone_name, capacity, price)
WHERE e.name = 'Meru Car Bazaar 2026'
ON CONFLICT (event_id, name) DO NOTHING;

-- Seed zones for the second event
INSERT INTO zones (event_id, name, capacity, price)
SELECT 
  e.id,
  zone_name,
  capacity,
  price
FROM events e
CROSS JOIN (
  VALUES
    ('10th - Premium Row', 60, 500),
    ('10th - Standard Row', 100, 500),
    ('10th - Motorcycles', 120, 500)
) AS zones(zone_name, capacity, price)
WHERE e.name = 'Meru 10th Anniversary 2026'
ON CONFLICT (event_id, name) DO NOTHING;

-- Create admin logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  staff_id UUID,
  admin_id UUID,
  description TEXT,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
