import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Manejar errores o retornar null/lanzar error según convenga
    console.error(`Error fetching ${url}:`, response.status, response.statusText);
    throw new Error(`Failed to fetch ${url}`);
  }

  return response.json();
}

export const serverApi = {
  get: <T>(url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: 'GET' }) as Promise<T>,
  post: <T>(url: string, body: any, options?: RequestInit) => fetchWithAuth(url, { ...options, method: 'POST', body: JSON.stringify(body) }) as Promise<T>,
  // Agregar otros métodos si son necesarios
};
