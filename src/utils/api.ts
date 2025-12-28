import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api";
import type { AxiosResponse } from "axios";


export type APIWrapperProps = {
    apiCall: Promise<AxiosResponse<any, any, {}>>;
    parser: <T>(data: any) => Promise<ApiResponse<T>>;
}

// Type guards / helpers
export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return (res as ApiSuccess<T>).status === 'success';
}

export function ensureSuccess<T>(res: ApiResponse<T>): T {
  if (!isApiSuccess(res)) {
    const err = res as ApiError;
    const e = new Error(err.message);
    (e as any).code = err.code;
    throw e;
  }
  return res.data;
}

// Convenience: parse JSON into typed ApiResponse<T>
export async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const json = await response.json();
  return json as ApiResponse<T>;
}

export async function apiWrapper<T> ({apiCall, parser}:APIWrapperProps): Promise<T> {
  const res = await apiCall;
  const data = await parser<T>(res.data);
  return ensureSuccess<T>(data);
}