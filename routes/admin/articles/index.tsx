/**
 * Articles List Page
 * Uses generic CRUD system
 */

import { define } from "../../../utils.ts";
import { AdminLayout } from "@/components/layout/AdminLayout.tsx";
import { DataTable } from "@/components/admin/DataTable.tsx";
import { Pagination } from "@/components/admin/Pagination.tsx";
import { createCRUDHandlers } from "@/lib/admin/crud-handlers.ts";
import { articleConfig } from "@/config/entities/articles.config.tsx";
import type { Article } from "@/entities/articles/article.types.ts";
import type { ListResponse } from "@/lib/admin/types.ts";

const handlers = createCRUDHandlers(articleConfig);

export const handler = define.handlers({
  GET: handlers.list,
});

export default define.page<typeof handler>(function ArticlesListPage({ data }) {
  const { items, config, error } = data;
  const response = items as ListResponse<Article>;

  return (
    <AdminLayout currentPath={`/admin/${config.name}`}>
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">{config.pluralName}</h1>
            <p class="text-base-content/60 mt-1">
              Manage your {config.pluralName.toLowerCase()}
            </p>
          </div>
          {config.canCreate !== false && (
            <a href={`/admin/${config.name}/new`} class="btn btn-primary">
              Create New {config.singularName}
            </a>
          )}
        </div>

        {error && (
          <div class="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <DataTable
              config={config}
              data={response.data}
            />

            {response.pagination && (
              <Pagination
                pagination={response.pagination}
                basePath={`/admin/${config.name}`}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
});
