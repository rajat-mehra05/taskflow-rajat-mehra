export interface ApiError {
  error: string
  fields?: Record<string, string>
}

function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  )
}

export class ApiRequestError extends Error {
  status: number
  body: ApiError

  constructor(status: number, body: ApiError) {
    super(body.error)
    this.status = status
    this.body = body
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  // 204 No Content — caller must use request<void>
  if (response.status === 204) {
    return undefined as unknown as T
  }

  const data: unknown = await response.json()

  if (!response.ok) {
    const error: ApiError = isApiError(data)
      ? data
      : { error: `Request failed with status ${response.status}` }

    throw new ApiRequestError(response.status, error)
  }

  // Trust the API contract — response shape matches T
  // In production, consider adding Zod response validation per-endpoint
  return data as T
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (url: string) => request<void>(url, { method: 'DELETE' }),
}
