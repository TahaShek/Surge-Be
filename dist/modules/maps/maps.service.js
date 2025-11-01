"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
exports.MapsService = {
    // ==================== LOCATIONS ====================
    async createLocation(data, userId) {
        const location = await models_1.LocationModel.create({
            ...data,
            createdBy: userId,
        });
        return new utils_1.ApiResponse(201, "Location created successfully", location);
    },
    async getLocations(query) {
        const { category, latitude, longitude, radius = "10", // default 10km
        limit = "50", page = "1", } = query;
        const filter = { isActive: true };
        // Filter by category
        if (category) {
            filter.category = category;
        }
        // Nearby search (basic implementation - for production use geospatial queries)
        let locations;
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            const radiusKm = parseFloat(radius);
            // Simple bounding box search (for more accurate, use MongoDB geospatial)
            const latDelta = radiusKm / 111; // 1 degree ≈ 111 km
            const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
            filter.latitude = { $gte: lat - latDelta, $lte: lat + latDelta };
            filter.longitude = { $gte: lng - lngDelta, $lte: lng + lngDelta };
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        locations = await models_1.LocationModel.find(filter)
            .populate("createdBy", "name email")
            .limit(limitNum)
            .skip(skip)
            .sort({ createdAt: -1 });
        const total = await models_1.LocationModel.countDocuments(filter);
        return new utils_1.ApiResponse(200, "Locations retrieved successfully", {
            locations,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    },
    async getLocationById(locationId) {
        const location = await models_1.LocationModel.findOne({
            _id: locationId,
            isActive: true,
        }).populate("createdBy", "name email");
        if (!location) {
            throw new utils_1.ApiError(404, "Location not found");
        }
        return new utils_1.ApiResponse(200, "Location retrieved successfully", location);
    },
    async updateLocation(locationId, data, userId) {
        const location = await models_1.LocationModel.findOne({
            _id: locationId,
            createdBy: userId,
        });
        if (!location) {
            throw new utils_1.ApiError(404, "Location not found or you don't have permission to update it");
        }
        Object.assign(location, data);
        await location.save();
        return new utils_1.ApiResponse(200, "Location updated successfully", location);
    },
    async deleteLocation(locationId, userId) {
        const location = await models_1.LocationModel.findOne({
            _id: locationId,
            createdBy: userId,
        });
        if (!location) {
            throw new utils_1.ApiError(404, "Location not found or you don't have permission to delete it");
        }
        // Soft delete
        location.isActive = false;
        await location.save();
        return new utils_1.ApiResponse(200, "Location deleted successfully");
    },
    // ==================== ROUTES ====================
    async createRoute(data, userId) {
        const route = await models_1.RouteModel.create({
            ...data,
            createdBy: userId,
        });
        return new utils_1.ApiResponse(201, "Route created successfully", route);
    },
    async getRoutes(query, userId) {
        const { limit = "50", page = "1" } = query;
        const filter = { isActive: true };
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const routes = await models_1.RouteModel.find(filter)
            .populate("createdBy", "name email")
            .limit(limitNum)
            .skip(skip)
            .sort({ createdAt: -1 });
        const total = await models_1.RouteModel.countDocuments(filter);
        return new utils_1.ApiResponse(200, "Routes retrieved successfully", {
            routes,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    },
    async getRouteById(routeId) {
        const route = await models_1.RouteModel.findOne({
            _id: routeId,
            isActive: true,
        }).populate("createdBy", "name email");
        if (!route) {
            throw new utils_1.ApiError(404, "Route not found");
        }
        return new utils_1.ApiResponse(200, "Route retrieved successfully", route);
    },
    async updateRoute(routeId, data, userId) {
        const route = await models_1.RouteModel.findOne({
            _id: routeId,
            createdBy: userId,
        });
        if (!route) {
            throw new utils_1.ApiError(404, "Route not found or you don't have permission to update it");
        }
        Object.assign(route, data);
        await route.save();
        return new utils_1.ApiResponse(200, "Route updated successfully", route);
    },
    async deleteRoute(routeId, userId) {
        const route = await models_1.RouteModel.findOne({
            _id: routeId,
            createdBy: userId,
        });
        if (!route) {
            throw new utils_1.ApiError(404, "Route not found or you don't have permission to delete it");
        }
        // Soft delete
        route.isActive = false;
        await route.save();
        return new utils_1.ApiResponse(200, "Route deleted successfully");
    },
    // ==================== UTILITY ====================
    async getMapStats(userId) {
        const totalLocations = await models_1.LocationModel.countDocuments({ isActive: true });
        const totalRoutes = await models_1.RouteModel.countDocuments({ isActive: true });
        const locationsByCategory = await models_1.LocationModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);
        return new utils_1.ApiResponse(200, "Map statistics retrieved successfully", {
            totalLocations,
            totalRoutes,
            locationsByCategory,
        });
    },
};
//# sourceMappingURL=maps.service.js.map