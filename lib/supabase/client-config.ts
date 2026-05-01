export const SUPABASE_REQUEST_TIMEOUT = 30000; // 30 seconds
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = SUPABASE_REQUEST_TIMEOUT,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};
