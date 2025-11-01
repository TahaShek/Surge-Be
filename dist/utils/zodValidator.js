"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResource = void 0;
const zod_1 = require("zod");
/**
 * Generic Zod validation middleware.
 * Accepts a schema like z.object({ body, params, query })
 */
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.issues,
            });
        }
        next(err);
    }
};
exports.validateResource = validateResource;
//# sourceMappingURL=zodValidator.js.map