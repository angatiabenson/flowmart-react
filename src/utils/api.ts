import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api";
import { isAxiosError, type AxiosResponse } from "axios";


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
export async function parseApiResponse<T>(data: any): Promise<ApiResponse<T>> {
  return data as ApiResponse<T>;
}

export async function apiWrapper<T> ({apiCall, parser}:APIWrapperProps): Promise<ApiResponse<T>> {
  try {
    const res = await apiCall;
    const data = await parser<T>(res.data);
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
        const responseData = err.response?.data as any;
        if (responseData && responseData.status === 'error' && responseData.message) {
             return responseData as ApiError;
        }
        return {
            status: 'error',
            code: err.response?.status || 500,
            message: typeof responseData === 'string' ? responseData : (responseData?.message || err.message || "Unknown API error")
        };
    }
    // Generic error
    return {
        status: 'error',
        code: 500,
        message: (err as Error).message || "An unexpected error occurred."
    };
  }
}