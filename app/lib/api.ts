import { useAppStore } from '../store/useAppStore';

export const BaseURL = `https://smile-backend-9ao3.onrender.com/api/v1`
// `http://localhost:8000/api/v1`
export async function apiRequest<T>({
  url,
  method = 'GET',
  data,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
}): Promise<T> {
  const token = useAppStore.getState().user.token;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (res.status === 401) {
    await useAppStore.getState().logout();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}
