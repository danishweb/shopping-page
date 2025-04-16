// Generic API response helpers
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function successResponse<T>(data: T, statusCode = 200): { statusCode: number; body: ApiResponse<T> } {
  return {
    statusCode,
    body: {
      success: true,
      data
    }
  };
}

export function errorResponse(code: string, message: string, details?: any, statusCode = 500): { statusCode: number; body: ApiResponse<null> } {
  return {
    statusCode,
    body: {
      success: false,
      error: {
        code,
        message,
        details
      }
    }
  };
}
