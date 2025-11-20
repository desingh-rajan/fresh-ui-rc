/**
 * API Client for tstack-kit backend
 * Handles authenticated requests with JWT tokens
 */

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(
    baseUrl: string = "http://localhost:8000",
    token: string | null = null,
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Make authenticated request
   */
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.token;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add existing headers
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };

      try {
        const data = await response.json();
        error.message = data.message || data.error || error.message;
        error.errors = data.errors;
      } catch {
        // Response not JSON
      }

      throw error;
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

/**
 * Create API client with specific token (for server-side use)
 */
export function createApiClient(token: string | null): ApiClient {
  return new ApiClient("http://localhost:8000", token);
}
