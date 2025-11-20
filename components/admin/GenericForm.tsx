/**
 * Generic Form Component
 * Generates forms dynamically based on entity configuration
 */

import type { EntityConfig, FieldConfig } from "@/lib/admin/types.ts";

interface FormProps<T = Record<string, unknown>> {
  config: EntityConfig<T>;
  item?: T;
  errors?: Record<string, string>;
  isEdit?: boolean;
}

export function GenericForm<T = Record<string, unknown>>(
  { config, item, errors, isEdit }: FormProps<T>,
) {
  const formFields = config.fields.filter((f) => f.showInForm !== false);

  const getValue = (fieldName: string): unknown => {
    if (item) {
      return (item as Record<string, unknown>)[fieldName];
    }
    return undefined;
  };

  const renderField = (field: FieldConfig): JSX.Element => {
    const value = getValue(field.name);
    const error = errors?.[field.name];
    const inputClasses = `input input-bordered ${error ? "input-error" : ""}`;
    const textareaClasses = `textarea textarea-bordered ${error ? "textarea-error" : ""}`;
    const selectClasses = `select select-bordered ${error ? "select-error" : ""}`;

    // ID field - readonly in edit mode
    if (isEdit && field.name === config.idField) {
      return (
        <div class="form-control" key={field.name}>
          <label class="label">
            <span class="label-text">{field.label}</span>
          </label>
          <input
            type="text"
            value={String(value || "")}
            disabled
            class="input input-bordered input-disabled"
          />
          <label class="label">
            <span class="label-text-alt text-base-content/60">
              {field.name === "id" ? "ID cannot be changed" : "Key cannot be changed"}
            </span>
          </label>
        </div>
      );
    }

    switch (field.type) {
      case "text":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <textarea
              name={field.name}
              required={field.required}
              class={textareaClasses}
              placeholder={field.placeholder}
              rows={field.rows || 4}
            >
              {String(value || "")}
            </textarea>
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "select":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <select
              name={field.name}
              required={field.required}
              class={selectClasses}
            >
              {!field.required && <option value="">-- Select --</option>}
              {field.options?.map((opt) => (
                <option
                  key={String(opt.value)}
                  value={String(opt.value)}
                  selected={value === opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "boolean":
        return (
          <div class="form-control" key={field.name}>
            <label class="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                name={field.name}
                class="checkbox"
                checked={Boolean(value)}
              />
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "number":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <input
              type="number"
              name={field.name}
              required={field.required}
              class={inputClasses}
              placeholder={field.placeholder}
              value={value !== null && value !== undefined ? String(value) : ""}
            />
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "email":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <input
              type="email"
              name={field.name}
              required={field.required}
              class={inputClasses}
              placeholder={field.placeholder}
              value={String(value || "")}
            />
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "date":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <input
              type="date"
              name={field.name}
              required={field.required}
              class={inputClasses}
              value={value ? new Date(value as string).toISOString().split("T")[0] : ""}
            />
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "datetime":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <input
              type="datetime-local"
              name={field.name}
              required={field.required}
              class={inputClasses}
              value={value ? new Date(value as string).toISOString().slice(0, 16) : ""}
            />
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      case "json":
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <textarea
              name={field.name}
              required={field.required}
              class={textareaClasses}
              placeholder={field.placeholder || "Enter valid JSON"}
              rows={field.rows || 6}
            >
              {value && typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value || "")}
            </textarea>
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );

      default:
        // Default to text input
        return (
          <div class="form-control" key={field.name}>
            <label class="label">
              <span class="label-text">
                {field.label}
                {field.required && <span class="text-error ml-1">*</span>}
              </span>
            </label>
            <input
              type="text"
              name={field.name}
              required={field.required}
              class={inputClasses}
              placeholder={field.placeholder}
              value={String(value || "")}
            />
            {error && (
              <label class="label">
                <span class="label-text-alt text-error">{error}</span>
              </label>
            )}
            {field.helpText && !error && (
              <label class="label">
                <span class="label-text-alt text-base-content/60">
                  {field.helpText}
                </span>
              </label>
            )}
          </div>
        );
    }
  };

  return (
    <form method="POST" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map((field) => {
          const isFullWidth = field.type === "text" || field.type === "json";
          return (
            <div
              key={field.name}
              class={isFullWidth ? "md:col-span-2" : ""}
            >
              {renderField(field)}
            </div>
          );
        })}
      </div>

      <div class="card-actions justify-end pt-4 border-t">
        <a
          href={`/admin/${config.name}`}
          class="btn btn-ghost"
        >
          Cancel
        </a>
        <button type="submit" class="btn btn-primary">
          {isEdit ? "Save Changes" : `Create ${config.singularName}`}
        </button>
      </div>
    </form>
  );
}
