// Shared constants across features

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const DEFAULT_LIMIT = 20;
export const DEFAULT_PAGE = 1;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

