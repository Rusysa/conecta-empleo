-- Custom API authentication: these users are independent of auth.users.
ALTER TABLE public.users ADD COLUMN privacy_accepted_at TIMESTAMPTZ;
ALTER TABLE public.sessions ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
CREATE INDEX sessions_user ON public.sessions(user_id);

-- Browsers must use the Express API. Never expose credentials via PostgREST.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.users, public.sessions, public.jobs, public.applications FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON public.users, public.sessions, public.jobs, public.applications FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON public.users, public.sessions, public.jobs, public.applications FROM authenticated;
  END IF;
END $$;
