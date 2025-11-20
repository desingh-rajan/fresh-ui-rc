/**
 * User Service
 * Handles all API calls for user management operations
 */

import { apiClient } from "@/lib/api.ts";
import type {
  CreateUserInput,
  DeleteUserResponse,
  UpdateUserInput,
  User,
  UserListResponse,
  UserResponse,
} from "./user.types.ts";

export class UserService {
  private readonly basePath = "/ts-admin/users";
  private client = apiClient;

  /**
   * Set API client with token (for server-side use)
   */
  setClient(client: typeof apiClient): void {
    this.client = client;
  }

  /**
   * List all users with pagination
   */
  async list(params?: {
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
  async getById(id: number): Promise<User> {
    return this.client.get<User>(
      `${this.basePath}/${id}`,
    );
  }

  /**
   * Create new admin/moderator user
   */
  async create(input: CreateUserInput): Promise<User> {
    return this.client.post<User>(
      this.basePath,
      input,
    );
  }

  /**
   * Update existing user
   */
  async update(id: number, input: UpdateUserInput): Promise<User> {
    return this.client.put<User>(
      `${this.basePath}/${id}`,
      input,
    );
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    await this.client.delete<DeleteUserResponse>(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const userService = new UserService();
