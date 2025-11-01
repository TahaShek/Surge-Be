"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutesQuerySchema = exports.getRouteByIdSchema = exports.updateRouteSchema = exports.createRouteSchema = exports.getLocationsQuerySchema = exports.getLocationByIdSchema = exports.updateLocationSchema = exports.createLocationSchema = void 0;
const zod_1 = require("zod");
// Location validators
exports.createLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").max(200),
        description: zod_1.z.string().max(1000).optional(),
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        category: zod_1.z.enum(["park", "shop", "attraction", "restaurant", "cafe", "other"]).optional(),
        icon: zod_1.z.string().optional(),
        metadata: zod_1.z.object({
            address: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            website: zod_1.z.string().url().optional(),
            rating: zod_1.z.number().min(0).max(5).optional(),
        }).optional(),
    }),
});
exports.updateLocationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Location ID is required"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().max(1000).optional(),
        latitude: zod_1.z.number().min(-90).max(90).optional(),
        longitude: zod_1.z.number().min(-180).max(180).optional(),
        category: zod_1.z.enum(["park", "shop", "attraction", "restaurant", "cafe", "other"]).optional(),
        icon: zod_1.z.string().optional(),
        metadata: zod_1.z.object({
            address: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            website: zod_1.z.string().url().optional(),
            rating: zod_1.z.number().min(0).max(5).optional(),
        }).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getLocationByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Location ID is required"),
    }),
});
exports.getLocationsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        category: zod_1.z.string().optional(),
        latitude: zod_1.z.string().optional(), // For nearby search
        longitude: zod_1.z.string().optional(),
        radius: zod_1.z.string().optional(), // km
        limit: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
    }),
});
// Route validators
exports.createRouteSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").max(200),
        description: zod_1.z.string().max(1000).optional(),
        coordinates: zod_1.z.array(zod_1.z.object({
            latitude: zod_1.z.number().min(-90).max(90),
            longitude: zod_1.z.number().min(-180).max(180),
        })).min(2, "Route must have at least 2 coordinates"),
        color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        weight: zod_1.z.number().min(1).max(10).optional(),
        distance: zod_1.z.number().min(0).optional(),
        duration: zod_1.z.number().min(0).optional(),
    }),
});
exports.updateRouteSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Route ID is required"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().max(1000).optional(),
        coordinates: zod_1.z.array(zod_1.z.object({
            latitude: zod_1.z.number().min(-90).max(90),
            longitude: zod_1.z.number().min(-180).max(180),
        })).min(2).optional(),
        color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        weight: zod_1.z.number().min(1).max(10).optional(),
        distance: zod_1.z.number().min(0).optional(),
        duration: zod_1.z.number().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getRouteByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Route ID is required"),
    }),
});
exports.getRoutesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=maps.validator.js.map