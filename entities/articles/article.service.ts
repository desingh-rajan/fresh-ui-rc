/**
 * Article Service
 * Handles all API calls for article CRUD operations
 */

import { apiClient } from "@/lib/api.ts";
import type {
  Article,
  ArticleListResponse,
  ArticleResponse,
  BulkDeleteResponse,
  CreateArticleInput,
  DeleteArticleResponse,
  UpdateArticleInput,
} from "./article.types.ts";

export class ArticleService {
  private readonly basePath = "/ts-admin/articles";
  private client = apiClient;

  /**
   * Set API client with token (for server-side use)
   */
  setClient(client: typeof apiClient): void {
    this.client = client;
  }

  /**
   * List all articles with pagination
   */
  async list(params?: {
    page?: number;
    pageSize?: number;
    status?: "draft" | "published";
  }): Promise<ArticleListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", params.pageSize.toString());
    }
    if (params?.status) {
      searchParams.set("status", params.status);
    }

    const query = searchParams.toString();
    const path = query ? `${this.basePath}?${query}` : this.basePath;

    return this.client.get<ArticleListResponse>(path);
  }

  /**
   * Get single article by ID
   */
  async getById(id: number): Promise<Article> {
    return this.client.get<Article>(
      `${this.basePath}/${id}`,
    );
  }

  /**
   * Create new article
   */
  async create(input: CreateArticleInput): Promise<Article> {
    return this.client.post<Article>(
      this.basePath,
      input,
    );
  }

  /**
   * Update existing article
   */
  async update(id: number, input: UpdateArticleInput): Promise<Article> {
    return this.client.put<Article>(
      `${this.basePath}/${id}`,
      input,
    );
  }

  /**
   * Delete single article
   */
  async delete(id: number): Promise<void> {
    await this.client.delete<DeleteArticleResponse>(`${this.basePath}/${id}`);
  }

  /**
   * Bulk delete multiple articles
   */
  async bulkDelete(ids: number[]): Promise<BulkDeleteResponse> {
    return this.client.post<BulkDeleteResponse>(
      `${this.basePath}/bulk-delete`,
      { ids },
    );
  }
}

// Export singleton instance
export const articleService = new ArticleService();
