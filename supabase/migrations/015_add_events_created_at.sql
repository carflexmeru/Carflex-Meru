-- Backfill events.created_at for the live database used by Prisma
-- Prisma's Event model includes createdAt, so the column must exist.

ALTER TABLE events
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE events
SET created_at = NOW()
WHERE created_at IS NULL;

