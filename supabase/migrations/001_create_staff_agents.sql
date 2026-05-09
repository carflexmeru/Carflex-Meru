-- Create storage bucket for staff documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-documents', 'staff-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Staff can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Staff can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete own documents" ON storage.objects;

-- Create RLS policy for staff storage
CREATE POLICY "Staff can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can read own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can delete own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'staff-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
