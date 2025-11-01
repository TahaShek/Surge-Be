export interface PaginationOptions {
  page: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}