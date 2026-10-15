-- Propuesta inicial para PostgreSQL. No se aplica automáticamente en el starter.
-- Ejecutar con un runner transaccional de migraciones cuando se implemente PLAT-01.
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
  bio TEXT NOT NULL DEFAULT '',
  resume_url VARCHAR(2048) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(120) NOT NULL,
  company VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  work_mode TEXT NOT NULL CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_min NUMERIC(12,2),
  salary_max NUMERIC(12,2),
  salary_currency CHAR(3),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((salary_min IS NULL AND salary_max IS NULL AND salary_currency IS NULL) OR
    (salary_min IS NOT NULL AND salary_max IS NOT NULL AND salary_currency IS NOT NULL
      AND salary_min >= 0 AND salary_max >= salary_min AND salary_currency IN ('MXN','USD','EUR'))),
  CHECK (status = 'draft' OR published_at IS NOT NULL)
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  candidate_id UUID NOT NULL REFERENCES users(id),
  cover_letter TEXT NOT NULL,
  resume_url VARCHAR(2048) NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','reviewing','interview','rejected','hired','withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, candidate_id)
);

CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX jobs_public_listing ON jobs (published_at DESC, id DESC) WHERE status = 'published';
CREATE INDEX jobs_employer ON jobs (employer_id, created_at DESC, id DESC);
CREATE INDEX applications_candidate ON applications (candidate_id, created_at DESC, id DESC);
CREATE INDEX sessions_expiry ON sessions (expires_at);

-- Los servicios deben actualizar updated_at, validar rol del autor/candidato,
-- aplicar permisos por propiedad y comprobar transiciones dentro de transacciones.
