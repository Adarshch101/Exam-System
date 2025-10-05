import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://exam-system-production-f3e8.up.railway.app';

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// api(path, { method, body, headers, successMessage, showErrorToast })
export async function api(path, { method = 'GET', body, headers = {}, successMessage, showErrorToast = true } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let message = err.error || `Request failed (${res.status})`;
    // Special handling for cooldown responses
    if (res.status === 429 && (err.retry_after_seconds || err.message)) {
      if (typeof err.retry_after_seconds === 'number') {
        const retry = err.retry_after_seconds;
        const h = Math.floor(retry / 3600);
        const m = Math.floor((retry % 3600) / 60);
        const s = retry % 60;
        message = err.message || `Please wait ${h}h ${m}m ${s}s before reattempting.`;
      } else if (err.message) {
        message = err.message;
      }
    }
    if (showErrorToast) toast.error(message);
    const e = new Error(message);
    // attach raw error for callers that need extra info
    e.data = err;
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  if (successMessage) toast.success(successMessage);
  return data;
}
