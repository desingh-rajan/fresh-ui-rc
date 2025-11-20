/**
 * Generic Admin CRUD System - Entity Configuration
 * Similar to Rails ActiveAdmin resource configuration
 */

export type FieldType = 
  | "string" 
  | "number" 
  | "boolean" 
  | "date" 
  | "datetime" 
  | "text" 
  | "email"
  | "select"
  | "json"
  | "status"
  | "badge";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  
  // Display options
  sortable?: boolean;
  searchable?: boolean;
  showInList?: boolean;
  showInShow?: boolean;
  showInForm?: boolean;
  required?: boolean;
  
  // For select fields
  options?: Array<{ value: string | number; label: string }>;
  
  // For custom rendering
  render?: (value: unknown, record: Record<string, unknown>) => string | JSX.Element;
  
  // Form options
  placeholder?: string;
  helpText?: string;
  rows?: number; // for textarea
  
  // Validation
  validate?: (value: unknown) => string | undefined;
  
  // Formatting
  format?: (value: unknown) => string;
}

export interface EntityConfig<T = Record<string, unknown>> {
  // Entity identification
  name: string;
  singularName: string;
  pluralName: string;
  
  // API configuration
  apiPath: string;
  idField: string; // 'id' or 'key' etc.
  
  // Field definitions
  fields: FieldConfig[];
  
  // Service instance
  service: {
    list: (params: { page: number; pageSize?: number }) => Promise<unknown>;
    getById?: (id: number | string) => Promise<T>;
    getByKey?: (key: string) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: number | string, data: Partial<T>) => Promise<T>;
    delete: (id: number | string) => Promise<void>;
    setClient: (client: unknown) => void;
  };
  
  // UI customization
  listTitle?: string;
  createTitle?: string;
  editTitle?: string;
  showTitle?: string;
  
  // Display configuration
  displayField?: string; // Field to show as title (e.g., 'name', 'title')
  descriptionField?: string; // Field to show as subtitle
  
  // Permissions
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  
  // Custom logic
  isSystemRecord?: (record: T) => boolean; // Prevent deletion of system records
  getRouteParam?: (record: T) => string | number; // Custom route param extraction
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationParams;
}

export interface CRUDHandlerContext {
  entityConfig: EntityConfig;
  authToken: string;
  params: Record<string, string>;
  formData?: FormData;
  searchParams?: URLSearchParams;
}
