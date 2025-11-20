/**
 * Article TypeScript types
 * Matches backend article.model.ts and article.dto.ts
 */

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  publishedAt?: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published";
  publishedAt?: string;
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  status?: "draft" | "published";
  publishedAt?: string;
}

export interface ArticleListResponse {
  success: boolean;
  data: Article[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
}

export interface DeleteArticleResponse {
  success: boolean;
  message: string;
}

export interface BulkDeleteResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}
