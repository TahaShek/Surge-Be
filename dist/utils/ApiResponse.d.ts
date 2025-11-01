export declare class ApiResponse<T> {
    status: number;
    message: string;
    data: T | null;
    success: boolean;
    constructor(status: number, message: string, data?: T | null, success?: boolean);
}
//# sourceMappingURL=ApiResponse.d.ts.map