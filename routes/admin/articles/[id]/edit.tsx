/**
 * Article Edit Page
 * Uses generic form system
 */

import { define } from "../../../../utils.ts";
import { AdminLayout } from "@/components/layout/AdminLayout.tsx";
import { GenericForm } from "@/components/admin/GenericForm.tsx";
import { createCRUDHandlers } from "@/lib/admin/crud-handlers.ts";
import { articleConfig } from "@/config/entities/articles.config.tsx";

const handlers = createCRUDHandlers(articleConfig);

export const handler = define.handlers({
  GET: handlers.editGet,
  POST: handlers.editPost,
});

export default define.page<typeof handler>(function ArticleEditPage({ data }) {
  const { config, item, error } = data;

  if (!item && !error) {
    return (
      <AdminLayout currentPath={`/admin/${config.name}`}>
        <div class="alert alert-warning">
          <span>{config.singularName} not found</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && !item) {
    return (
      <AdminLayout currentPath={`/admin/${config.name}`}>
        <div class="alert alert-error">
          <span>{error}</span>
        </div>
      </AdminLayout>
    );
  }

  const identifier = config.getRouteParam
    ? config.getRouteParam(item!)
    : (item as Record<string, unknown>)?.[config.idField];

  return (
    <AdminLayout currentPath={`/admin/${config.name}`}>
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">
              {config.editTitle || `Edit ${config.singularName}`}
            </h1>
            {config.displayField && item && (
              <p class="text-base-content/60 mt-1">
                {String((item as Record<string, unknown>)[config.displayField])}
              </p>
            )}
          </div>
          <a
            href={`/admin/${config.name}/${identifier}`}
            class="btn btn-ghost"
          >
            Cancel
          </a>
        </div>

        {error && (
          <div class="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <GenericForm
              config={config}
              item={item}
              isEdit
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
});
