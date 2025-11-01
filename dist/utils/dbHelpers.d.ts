interface PaginationParams {
    page?: string | number;
    limit?: string | number;
}
interface PaginationGetResult {
    page: number;
    limit: number;
    skip: number;
}
export declare const getPagination: (params: PaginationParams) => PaginationGetResult;
interface BuildQueryOptions {
    allowedFields: string[];
    searchField?: string;
}
export declare function buildQuery(params: Record<string, any>, options: BuildQueryOptions): Record<string, any>;
export {};
//# sourceMappingURL=dbHelpers.d.ts.map