/**
 * Site Setting Edit Page - Uses generic form system
 */

import { define } from "@/utils.ts";
import { AdminLayout } from "@/components/layout/AdminLayout.tsx";
import { GenericForm } from "@/components/admin/GenericForm.tsx";
import { createCRUDHandlers } from "@/lib/admin/crud-handlers.ts";
import { siteSettingConfig } from "@/config/entities/site-settings.config.tsx";
import type { EntityConfig } from "@/lib/admin/types.ts";

const handlers = createCRUDHandlers(siteSettingConfig);

export const handler = define.handlers({
  GET: handlers.editGet,
  POST: handlers.editPost,
});

export default define.page<typeof handler>(
  function SiteSettingEditPage({ data }) {
    const { config, item, error, errors } = data;

    if (!item && !error) {
      return (
        <AdminLayout currentPath={`/admin/${config.name}`}>
          <div class="alert alert-warning">
            <span>{config.singularName} not found</span>
          </div>
        </AdminLayout>
      );
    }

    const identifier = config.getRouteParam
      ? config.getRouteParam(item)
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
                  {String(
                    (item as Record<string, unknown>)[config.displayField],
                  )}
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
            <div class="alert alert-error shadow-lg">
              <div>
                <span>{error}</span>
              </div>
              {errors && Object.keys(errors).length > 0 && (
                <div class="mt-2 text-sm">
                  <p class="font-semibold mb-1">Details:</p>
                  <ul class="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>
                        <strong>{field || "Value"}:</strong> {message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {item && (
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <GenericForm
                  config={config as EntityConfig<unknown>}
                  item={item}
                  errors={errors}
                  isEdit
                />
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  },
);
