/**
 * User Service
 * Handles all API calls for user management operations
 */

import { apiClient } from "@/lib/api.ts";
import type { HttpClient } from "@/lib/admin/types.ts";
import type {
  DeleteUserResponse,
  User,
  UserListResponse,
} from "./user.types.ts";

export class UserService {
  private readonly basePath = "/ts-admin/users";
  private client: HttpClient = apiClient;

  /**
   * Set API client with token (for server-side use)
   */
  setClient(client: HttpClient): void {
    this.client = client;
  }

  /**
   * List all users with pagination
   */
  list(params?: {
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    const query = searchParams.toString();
    const path = query ? `${this.basePath}?${query}` : this.basePath;

    return this.client.get<UserListResponse>(path);
  }

  /**
   * Get single user by ID
   */
  getById(id: string | number): Promise<User> {
    return this.client.get<User>(
      `${this.basePath}/${id}`,
    );
  }

  /**
   * Create new admin/moderator user
   */
  create(input: Partial<User>): Promise<User> {
    return this.client.post<User>(
      this.basePath,
      input,
    );
  }

  /**
   * Update existing user
   */
  update(id: string | number, input: Partial<User>): Promise<User> {
    return this.client.put<User>(
      `${this.basePath}/${id}`,
      input,
    );
  }

  /**
   * Delete user
   */
  delete(id: string | number): Promise<void> {
    return this.client.delete<DeleteUserResponse>(`${this.basePath}/${id}`)
      .then(() => undefined);
  }
}

// Export singleton instance
export const userService = new UserService();
