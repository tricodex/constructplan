import { useState } from 'react';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetch: (url: string, options?: FetchOptions) => Promise<void>;
}

export function useFetch<T>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url: string, options: FetchOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { params, ...init } = options;
      const queryParams = params ? `?${new URLSearchParams(params)}` : '';
      const response = await fetch(`${url}${queryParams}`, init);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetch: fetchData };
}