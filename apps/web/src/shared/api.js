import { API_PREFIX } from '@conecta/contracts';

export async function api(path, options = {}) {
  const response = await fetch(`${API_PREFIX}${path}`, { credentials: 'same-origin', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? 'No se pudo completar la solicitud.');
  return data;
}
