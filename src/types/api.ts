// Common API types and small helpers for typed deserialization
export type ApiSuccess<T> = {
  status: 'success';
  data: T;
};

export type ApiError = {
  code: number;
  status: 'error';
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Domain types
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  created_at?: string;
};

export type LoginResponseData = {
  message: string;
  api_key: string; // Bearer token string
  user: User;
};

export type LoginResponse = ApiSuccess<LoginResponseData>;
