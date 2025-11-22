/**
 * Article Create Page
 * Uses generic form system
 */

import { define } from "@/utils.ts";
import { AdminLayout } from "@/components/layout/AdminLayout.tsx";
import { GenericForm } from "@/components/admin/GenericForm.tsx";
import { createCRUDHandlers } from "@/lib/admin/crud-handlers.ts";
import { articleConfig } from "@/config/entities/articles.config.tsx";
import type { EntityConfig } from "@/lib/admin/types.ts";

const handlers = createCRUDHandlers(articleConfig);

export const handler = define.handlers({
  GET: handlers.createGet,
  POST: handlers.createPost,
});

export default define.page<typeof handler>(
  function ArticleCreatePage({ data }) {
    const { config, error, errors, values } = data;

    return (
      <AdminLayout currentPath={`/admin/${config.name}`}>
        <div class="space-y-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900">
                {config.createTitle || `Create New ${config.singularName}`}
              </h1>
              <p class="text-base text-gray-500 mt-2">
                Fill in the details below to create a new article
              </p>
            </div>
            <a
              href={`/admin/${config.name}`}
              class="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </a>
          </div>

          {error && (
            <div class="rounded-lg bg-red-50 border border-red-200 p-4">
              <p class="text-sm font-semibold text-red-900">Error</p>
              <p class="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div class="p-8">
              <GenericForm
                config={config as EntityConfig<unknown>}
                item={values}
                errors={errors}
                isEdit={false}
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  },
);
