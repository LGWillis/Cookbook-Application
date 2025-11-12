const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export function authHeaders() {
  const token = localStorage.getItem('access');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `${API_BASE}${path}`;
  const opts = { method, headers: { ...headers }, credentials: 'include' };
  if (body && !(body instanceof FormData)) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    opts.body = body; // browser sets Content-Type boundary
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) {
    const err = new Error('API error');
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}

export const UsersAPI = {
  async register(data) {
    return api('/api/users/register', { method: 'POST', body: data });
  },
  async login(username, password) {
    return api('/api/users/token', { method: 'POST', body: { username, password } });
  },
  async me() {
    return api('/api/users/me', { headers: { ...authHeaders() } });
  },
  async refresh(refresh) {
    return api('/api/users/token/refresh', { method: 'POST', body: { refresh } });
  }
};

export const RecipesAPI = {
  async list(q) {
    const qs = q ? `?q=${encodeURIComponent(q)}` : '';
    return api(`/api/recipes/${qs}`, { headers: { ...authHeaders() } });
  },
  async create(data) {
    const isMultipart = data instanceof FormData;
    return api('/api/recipes/', { method: 'POST', headers: { ...authHeaders() }, body: data });
  },
  async update(id, data) {
    return api(`/api/recipes/${id}/`, { method: 'PUT', headers: { ...authHeaders() }, body: data });
  },
  async remove(id) {
    return api(`/api/recipes/${id}/`, { method: 'DELETE', headers: { ...authHeaders() } });
  }
};
