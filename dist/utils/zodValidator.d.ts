import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
/**
 * Generic Zod validation middleware.
 * Accepts a schema like z.object({ body, params, query })
 */
export declare const validateResource: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=zodValidator.d.ts.map