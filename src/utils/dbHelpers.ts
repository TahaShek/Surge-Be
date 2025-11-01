interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

interface PaginationGetResult {
  page: number;
  limit: number;
  skip: number;
}

const MAX_LIMIT = 100;

export const getPagination = (
  params: PaginationParams
): PaginationGetResult => {
  const page = params.page ? parseInt(params.page as string, 10) : 1;
  let limit = params.limit ? parseInt(params.limit as string, 10) : 10;
  const skip = (page - 1) * limit;

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  return { page, limit, skip };
};

interface BuildQueryOptions {
  allowedFields: string[];
  searchField?: string;
}

export function buildQuery(
  params: Record<string, any>,
  options: BuildQueryOptions
): Record<string, any> {
  const filter: Record<string, any> = {};

  for (const field of options.allowedFields) {
    if (params[field] !== undefined) {
      filter[field] = params[field];
    }
  }

  if (options.searchField && params.search) {
    filter[options.searchField] = { $regex: params.search, $options: "i" };
  }

  return filter;
}
