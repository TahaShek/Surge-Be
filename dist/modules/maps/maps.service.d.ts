import { ApiResponse } from "../../utils";
import type { CreateLocationData, UpdateLocationData, LocationQueryData, CreateRouteData, UpdateRouteData, RouteQueryData } from "./maps.validator";
import mongoose from "mongoose";
export declare const MapsService: {
    createLocation(data: CreateLocationData, userId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").ILocation, {}, {}> & import("../../models").ILocation & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    getLocations(query: LocationQueryData): Promise<ApiResponse<{
        locations: (mongoose.Document<unknown, {}, import("../../models").ILocation, {}, {}> & import("../../models").ILocation & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>>;
    getLocationById(locationId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").ILocation, {}, {}> & import("../../models").ILocation & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    updateLocation(locationId: string, data: UpdateLocationData, userId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").ILocation, {}, {}> & import("../../models").ILocation & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    deleteLocation(locationId: string, userId: string): Promise<ApiResponse<unknown>>;
    createRoute(data: CreateRouteData, userId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").IRoute, {}, {}> & import("../../models").IRoute & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    getRoutes(query: RouteQueryData, userId?: string): Promise<ApiResponse<{
        routes: (mongoose.Document<unknown, {}, import("../../models").IRoute, {}, {}> & import("../../models").IRoute & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>>;
    getRouteById(routeId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").IRoute, {}, {}> & import("../../models").IRoute & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    updateRoute(routeId: string, data: UpdateRouteData, userId: string): Promise<ApiResponse<mongoose.Document<unknown, {}, import("../../models").IRoute, {}, {}> & import("../../models").IRoute & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>>;
    deleteRoute(routeId: string, userId: string): Promise<ApiResponse<unknown>>;
    getMapStats(userId?: string): Promise<ApiResponse<{
        totalLocations: number;
        totalRoutes: number;
        locationsByCategory: any[];
    }>>;
};
//# sourceMappingURL=maps.service.d.ts.map