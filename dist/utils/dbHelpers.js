"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
exports.buildQuery = buildQuery;
const MAX_LIMIT = 100;
const getPagination = (params) => {
    const page = params.page ? parseInt(params.page, 10) : 1;
    let limit = params.limit ? parseInt(params.limit, 10) : 10;
    const skip = (page - 1) * limit;
    if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
    }
    return { page, limit, skip };
};
exports.getPagination = getPagination;
function buildQuery(params, options) {
    const filter = {};
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
//# sourceMappingURL=dbHelpers.js.map