-- Create enrollments table to store enrollment history
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  pseudo TEXT,
  birth_date TEXT,
  birth_place TEXT,
  how_heard TEXT,
  how_heard_source TEXT,
  photo_url TEXT,
  phone TEXT NOT NULL,
  level TEXT,
  has_team TEXT,
  categories TEXT,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create GHL execution log table
CREATE TABLE IF NOT EXISTS public.ghl_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  request_payload JSONB,
  response_status TEXT,
  response_body TEXT,
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_execution_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions) - no auth required
CREATE POLICY "allow_public_insert_enrollments" ON public.enrollments 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_public_select_enrollments" ON public.enrollments 
  FOR SELECT USING (true);

CREATE POLICY "allow_public_insert_ghl_logs" ON public.ghl_execution_logs 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_public_select_ghl_logs" ON public.ghl_execution_logs 
  FOR SELECT USING (true);

-- Enhanced indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON public.enrollments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ghl_logs_enrollment_id ON public.ghl_execution_logs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_ghl_logs_executed_at ON public.ghl_execution_logs(executed_at DESC);
-- Add composite index for enrollment with logs
CREATE INDEX IF NOT EXISTS idx_enrollments_with_logs 
  ON public.enrollments(created_at DESC) 
  INCLUDE (id);
-- Optimize foreign key lookups
ALTER TABLE public.ghl_execution_logs
  ADD CONSTRAINT fk_ghl_enrollment 
  FOREIGN KEY (enrollment_id) 
  REFERENCES public.enrollments(id) 
  ON DELETE CASCADE;

-- Check table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'enrollments'
);
-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'enrollments';