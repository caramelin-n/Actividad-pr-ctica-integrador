// src/api/client.ts
// El fallback cubre el caso de correr "pnpm dev" sin .env.
// Ojo: String(undefined) devuelve "undefined", que es truthy, asi que
// hay que chequear el valor crudo, no su version en string.
const BASE_URL: string = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status
  };
};
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void{
  onUnauthorized = handler
};
type Method = "GET" | "POST" | "PATCH" | "DELETE";
async function request<T>(
  path: string,
  method: Method,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (response.status === 401) {
    onUnauthorized?.();
  };
  if (!response.ok){
    const fallback = await response.text()
    throw new ApiError(
      response.status, fallback || response.statusText
    );
  };
  const text = await response.text();
  return (text ? JSON.parse(text): undefined) as T
};
export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body?: unknown) => request<T>(path, 'POST', body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, 'PATCH', body),
  delete: <T>(path: string) => request<T>(path, 'DELETE'),
};
