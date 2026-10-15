export function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role, bio: row.bio, resumeUrl: row.resume_url, createdAt: new Date(row.created_at).toISOString() };
}

export async function createUser(client, { name, email, role, passwordHash }) {
  const { rows } = await client.query('INSERT INTO public.users (name, email, role, password_hash, privacy_accepted_at) VALUES ($1,$2,$3,$4,now()) RETURNING *', [name, email, role, passwordHash]);
  return publicUser(rows[0]);
}

export async function updateProfile(database, id, fields) {
  const { rows } = await database.query('UPDATE public.users SET name=coalesce($2,name), bio=coalesce($3,bio), resume_url=coalesce($4,resume_url), updated_at=now() WHERE id=$1 RETURNING *', [id, fields.name ?? null, fields.bio ?? null, fields.resumeUrl ?? null]);
  return publicUser(rows[0]);
}
