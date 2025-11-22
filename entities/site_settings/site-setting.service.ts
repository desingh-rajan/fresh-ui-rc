/**
 * Site Setting Service
 * Handles all API calls for site settings CRUD operations
 */

import { apiClient } from "@/lib/api.ts";
import type {
  CreateSiteSettingInput,
  DeleteSiteSettingResponse,
  SettingCategory,
  SiteSetting,
  SiteSettingListResponse,
  UpdateSiteSettingInput,
} from "./site-setting.types.ts";

export class SiteSettingService {
  private readonly basePath = "/ts-admin/site_settings";
  private client = apiClient;

  /**
   * Set API client with token (for server-side use)
   */
  setClient(client: typeof apiClient): void {
    this.client = client;
  }

  /**
   * List all site settings with pagination
   */
  list(params?: {
    page?: number;
    pageSize?: number;
    category?: SettingCategory;
  }): Promise<SiteSettingListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", params.pageSize.toString());
    }
    if (params?.category) {
      searchParams.set("category", params.category);
    }

    const query = searchParams.toString();
    const path = query ? `${this.basePath}?${query}` : this.basePath;

    return this.client.get<SiteSettingListResponse>(path);
  }

  /**
   * Get single site setting by ID
   */
  getById(id: number): Promise<SiteSetting> {
    return this.client.get<SiteSetting>(
      `${this.basePath}/${id}`,
    );
  }

  /**
   * Create new site setting
   */
  create(input: CreateSiteSettingInput): Promise<SiteSetting> {
    return this.client.post<SiteSetting>(
      this.basePath,
      input,
    );
  }

  /**
   * Update existing site setting by ID
   */
  update(
    id: number,
    input: UpdateSiteSettingInput,
  ): Promise<SiteSetting> {
    return this.client.put<SiteSetting>(
      `${this.basePath}/${id}`,
      input,
    );
  }

  /**
   * Delete single site setting by ID
   */
  async delete(id: number): Promise<void> {
    await this.client.delete<DeleteSiteSettingResponse>(
      `${this.basePath}/${id}`,
    );
  }
}

// Export singleton instance
export const siteSettingService = new SiteSettingService();
