// TypeScript type definitions for tracer
// Resolves: TSPerf challenge submission: TypeMeter — compiler-level type load-time, complexity AND cost attribution

export interface TracerConfig {
  /** API key for authentication (required) */
  apiKey: string;
  /** Request timeout in milliseconds (default: 5000) */
  timeout?: number;
  /** Number of automatic retries on failure (default: 3) */
  retries?: number;
  /** Base URL for API requests */
  baseUrl?: string;
}

export interface TracerResult<T = unknown> {
  data: T;
  error: null;
  metadata: { timestamp: string; requestId: string };
}

export interface TracerError {
  data: null;
  error: { code: string; message: string; details?: unknown };
  metadata: { timestamp: string; requestId: string };
}

export type ApiResponse<T = unknown> = TracerResult<T> | TracerError;
