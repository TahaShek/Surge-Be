import { z } from "zod";
export declare const createLocationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        category: z.ZodOptional<z.ZodEnum<{
            park: "park";
            shop: "shop";
            attraction: "attraction";
            restaurant: "restaurant";
            cafe: "cafe";
            other: "other";
        }>>;
        icon: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            website: z.ZodOptional<z.ZodString>;
            rating: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateLocationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodEnum<{
            park: "park";
            shop: "shop";
            attraction: "attraction";
            restaurant: "restaurant";
            cafe: "cafe";
            other: "other";
        }>>;
        icon: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            website: z.ZodOptional<z.ZodString>;
            rating: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getLocationByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getLocationsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
        latitude: z.ZodOptional<z.ZodString>;
        longitude: z.ZodOptional<z.ZodString>;
        radius: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createRouteSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        coordinates: z.ZodArray<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>>;
        color: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodNumber>;
        distance: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateRouteSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        coordinates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>>>;
        color: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodNumber>;
        distance: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getRouteByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getRoutesQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateLocationData = z.infer<typeof createLocationSchema>["body"];
export type UpdateLocationData = z.infer<typeof updateLocationSchema>["body"];
export type LocationQueryData = z.infer<typeof getLocationsQuerySchema>["query"];
export type CreateRouteData = z.infer<typeof createRouteSchema>["body"];
export type UpdateRouteData = z.infer<typeof updateRouteSchema>["body"];
export type RouteQueryData = z.infer<typeof getRoutesQuerySchema>["query"];
//# sourceMappingURL=maps.validator.d.ts.map