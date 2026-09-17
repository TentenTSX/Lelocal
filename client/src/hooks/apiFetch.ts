// In production the API is exposed by the same Vercel project under /api.
// VITE_API_URL remains useful locally (for example http://localhost:3310).
const BASE_URL = import.meta.env.VITE_API_URL ?? "";
export const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "/log-in";
};

const getToken = () =>
  localStorage.getItem("token") ?? sessionStorage.getItem("token");

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      // Si FormData, pas de Content-Type → le browser le gère avec la boundary
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};
