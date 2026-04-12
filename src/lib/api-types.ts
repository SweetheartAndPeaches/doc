/**
 * 接口文档类型定义
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  enum?: string[];
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: {
    type: string;
    properties?: Record<string, {
      type: string;
      description: string;
      example?: string;
    }>;
  };
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  parameters?: ApiParameter[];
  requestBody?: {
    description: string;
    contentType: string;
    schema: ApiParameter[];
  };
  responses: ApiResponse[];
  examples?: {
    request?: string;
    response?: string;
  };
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ApiDocument {
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  categories: ApiCategory[];
  endpoints: ApiEndpoint[];
}
