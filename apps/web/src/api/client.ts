const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api/v1";

export async function apiGet(path: string) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}
