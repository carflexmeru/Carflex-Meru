-- Add event_name column to vehicles table
-- This column stores the event name for vehicles at events

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS event_name TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_event_name ON vehicles(event_name);
