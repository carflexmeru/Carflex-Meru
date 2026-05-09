-- Seed zones with specific IDs for testing
-- Get existing event IDs and insert zones
INSERT INTO zones (id, event_id, name, capacity, occupancy, price, created_at)
SELECT 
  zone_id::uuid,
  e.id,
  zone_name,
  capacity,
  0,
  price,
  NOW()
FROM events e
CROSS JOIN (
  VALUES
    ('6af65648-f819-49f4-aaf9-212e617adebe', 'Zone A - Premium Row', 50, 1500),
    ('550e8400-e29b-41d4-a716-446655440002', 'Zone B - Standard Row', 80, 1000),
    ('550e8400-e29b-41d4-a716-446655440003', 'Zone C - Motorcycles', 100, 500)
) AS zones(zone_id, zone_name, capacity, price)
WHERE e.name = 'Meru Car Bazaar 2026'
ON CONFLICT (id) DO NOTHING;

-- Seed zones for the second event
INSERT INTO zones (id, event_id, name, capacity, occupancy, price, created_at)
SELECT 
  zone_id::uuid,
  e.id,
  zone_name,
  capacity,
  0,
  price,
  NOW()
FROM events e
CROSS JOIN (
  VALUES
    ('550e8400-e29b-41d4-a716-446655440004', '10th - Premium Row', 60, 500),
    ('550e8400-e29b-41d4-a716-446655440005', '10th - Standard Row', 100, 500),
    ('550e8400-e29b-41d4-a716-446655440006', '10th - Motorcycles', 120, 500)
) AS zones(zone_id, zone_name, capacity, price)
WHERE e.name = 'Meru 10th Anniversary 2026'
ON CONFLICT (id) DO NOTHING;
