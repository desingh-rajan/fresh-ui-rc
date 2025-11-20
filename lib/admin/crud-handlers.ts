/**
 * Generic CRUD Route Handlers
 * Reusable handlers for list, show, create, edit, delete operations
 */

import type { CRUDHandlerContext, EntityConfig } from "./types.ts";
import { createApiClient } from "@/lib/api.ts";

export function createCRUDHandlers<T = Record<string, unknown>>(
  config: EntityConfig<T>,
) {
  return {
    // List handler
    async list(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const url = new URL(ctx.req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        const result = await config.service.list({ page, pageSize });

        return {
          data: {
            items: result,
            config,
            page,
            pageSize,
          },
        };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes("Unauthorized") ||
            error.message.includes("401"))
        ) {
          return new Response(null, {
            status: 303,
            headers: { Location: "/auth/login" },
          });
        }

        console.error(`${config.name} list error:`, error);
        return {
          data: {
            items: {
              success: false,
              data: [],
              pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            },
            config,
            error: error instanceof Error
              ? error.message
              : `Failed to load ${config.pluralName}`,
          },
        };
      }
    },

    // Show handler
    async show(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const identifier = ctx.params[config.idField];
        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        let item: T;
        if (config.idField === "id") {
          item = await config.service.getById!(parseInt(identifier));
        } else {
          item = await config.service.getByKey!(identifier);
        }

        // Ensure item is not null/undefined
        if (!item) {
          return {
            data: {
              item: null,
              error: `${config.singularName} not found`,
              config,
            },
          };
        }

        return { data: { item, config, error: undefined } };
      } catch (error) {
        console.error(`${config.name} show error:`, error);
        return {
          data: {
            item: null,
            error: error instanceof Error
              ? error.message
              : `Failed to load ${config.singularName}`,
            config,
          },
        };
      }
    },

    // Create GET handler
    async createGet(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      return { data: { config } };
    },

    // Create POST handler
    async createPost(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const form = await ctx.req.formData();
        const data: Record<string, unknown> = {};

        // Decode JWT token to get current user ID
        let currentUserId: number | null = null;
        try {
          const payload = authToken.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          currentUserId = decoded.userId || decoded.id || null;
        } catch {
          console.warn("Failed to decode auth token");
        }

        // Extract form fields based on config
        for (const field of config.fields) {
          if (!field.showInForm) continue;

          const value = form.get(field.name);

          if (field.type === "boolean") {
            data[field.name] = value === "on";
          } else if (field.type === "number") {
            data[field.name] = value ? parseInt(value as string) : null;
          } else if (field.type === "json") {
            try {
              data[field.name] = value ? JSON.parse(value as string) : null;
            } catch {
              data[field.name] = value;
            }
          } else {
            data[field.name] = value;
          }
        }

        // Automatically set authorId if field exists and user is authenticated
        if (currentUserId && config.fields.some((f) => f.name === "authorId")) {
          data["authorId"] = currentUserId;
        }

        // Validate required fields
        const errors: Record<string, string> = {};
        for (const field of config.fields) {
          if (field.required && !data[field.name]) {
            errors[field.name] = `${field.label} is required`;
          }

          if (field.validate && data[field.name]) {
            const error = field.validate(data[field.name]);
            if (error) errors[field.name] = error;
          }
        }

        if (Object.keys(errors).length > 0) {
          return {
            data: {
              config,
              errors,
              values: data,
            },
          };
        }

        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        const result = await config.service.create(data as Partial<T>);

        // Extract ID for redirect - handle undefined/null result
        const identifier = result && config.getRouteParam
          ? config.getRouteParam(result)
          : result
          ? (result as Record<string, unknown>)?.[config.idField]
          : null;

        if (identifier) {
          return new Response(null, {
            status: 303,
            headers: {
              Location: `/admin/${config.name}/${identifier}`,
            },
          });
        }

        // Fallback to list page if no identifier
        return new Response(null, {
          status: 303,
          headers: { Location: `/admin/${config.name}` },
        });
      } catch (error) {
        console.error(`${config.name} create error:`, error);

        // Re-extract form values to show them again
        const form = await ctx.req.formData();
        const values: Record<string, unknown> = {};

        for (const field of config.fields) {
          if (!field.showInForm) continue;
          const value = form.get(field.name);

          if (field.type === "boolean") {
            values[field.name] = value === "on";
          } else if (field.type === "number") {
            values[field.name] = value ? parseInt(value as string) : null;
          } else if (field.type === "json") {
            try {
              values[field.name] = value ? JSON.parse(value as string) : null;
            } catch {
              values[field.name] = value;
            }
          } else {
            values[field.name] = value;
          }
        }

        return {
          data: {
            config,
            error: error instanceof Error
              ? error.message
              : `Failed to create ${config.singularName}`,
            values,
          },
        };
      }
    },

    // Edit GET handler
    async editGet(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const identifier = ctx.params[config.idField];
        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        let item: T;
        if (config.idField === "id") {
          item = await config.service.getById!(parseInt(identifier));
        } else {
          item = await config.service.getByKey!(identifier);
        }

        // Ensure item is not null/undefined
        if (!item) {
          return {
            data: {
              item: null,
              error: `${config.singularName} not found`,
              errors: {},
              config,
            },
          };
        }

        return { data: { item, config, error: undefined, errors: {} } };
      } catch (error) {
        console.error(`${config.name} edit GET error:`, error);
        return {
          data: {
            item: null,
            error: error instanceof Error
              ? error.message
              : `Failed to load ${config.singularName}`,
            errors: {},
            config,
          },
        };
      }
    },

    // Edit POST handler
    async editPost(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const identifier = ctx.params[config.idField];
        const form = await ctx.req.formData();
        const data: Record<string, unknown> = {};

        // Extract form fields
        for (const field of config.fields) {
          if (!field.showInForm) continue;

          const value = form.get(field.name);

          if (field.type === "boolean") {
            data[field.name] = value === "on";
          } else if (field.type === "number") {
            data[field.name] = value ? parseInt(value as string) : null;
          } else if (field.type === "json") {
            try {
              data[field.name] = value ? JSON.parse(value as string) : null;
            } catch {
              data[field.name] = value;
            }
          } else {
            data[field.name] = value;
          }
        }

        // Validate
        const errors: Record<string, string> = {};
        for (const field of config.fields) {
          if (field.required && !data[field.name]) {
            errors[field.name] = `${field.label} is required`;
          }

          if (field.validate && data[field.name]) {
            const error = field.validate(data[field.name]);
            if (error) errors[field.name] = error;
          }
        }

        if (Object.keys(errors).length > 0) {
          const apiClient = createApiClient(authToken);
          config.service.setClient(apiClient);

          let item: T;
          if (config.idField === "id") {
            item = await config.service.getById!(parseInt(identifier));
          } else {
            item = await config.service.getByKey!(identifier);
          }

          return {
            data: {
              item,
              config,
              errors,
            },
          };
        }

        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        await config.service.update(
          config.idField === "id" ? parseInt(identifier) : identifier,
          data as Partial<T>,
        );

        return new Response(null, {
          status: 303,
          headers: { Location: `/admin/${config.name}/${identifier}` },
        });
      } catch (error) {
        console.error(`${config.name} edit POST error:`, error);
        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        const identifier = ctx.params[config.idField];
        let item: T;
        if (config.idField === "id") {
          item = await config.service.getById!(parseInt(identifier));
        } else {
          item = await config.service.getByKey!(identifier);
        }

        return {
          data: {
            item,
            config,
            error: error instanceof Error
              ? error.message
              : `Failed to update ${config.singularName}`,
          },
        };
      }
    },

    // Delete handler
    async delete(ctx: { req: Request; params: Record<string, string> }) {
      const cookies = ctx.req.headers.get("cookie") || "";
      const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];

      if (!authToken) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/auth/login" },
        });
      }

      try {
        const identifier = ctx.params[config.idField];
        const apiClient = createApiClient(authToken);
        config.service.setClient(apiClient);

        if (config.idField === "id") {
          await config.service.delete!(parseInt(identifier));
        } else {
          await config.service.delete!(identifier);
        }

        return new Response(null, {
          status: 303,
          headers: { Location: `/admin/${config.name}` },
        });
      } catch (error) {
        console.error(`${config.name} delete error:`, error);
        return new Response(null, {
          status: 303,
          headers: { Location: `/admin/${config.name}` },
        });
      }
    },
  };
}
