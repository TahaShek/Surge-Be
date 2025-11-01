"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueryBuilder = void 0;
exports.buildJobQuery = buildJobQuery;
exports.buildJobSortOptions = buildJobSortOptions;
class JobQueryBuilder {
    constructor() {
        this.query = {};
    }
    addSearchFilter(search) {
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            this.query.$or = [
                { title: searchRegex },
                { skills: { $in: [searchRegex] } },
            ];
        }
        return this;
    }
    addJobTypeFilter(jobType) {
        if (jobType) {
            this.query.jobType = Array.isArray(jobType) ? { $in: jobType } : jobType;
        }
        return this;
    }
    addExperienceLevelFilter(experienceLevel) {
        if (experienceLevel) {
            this.query.experienceLevel = Array.isArray(experienceLevel)
                ? { $in: experienceLevel }
                : experienceLevel;
        }
        return this;
    }
    addLocationFilter(location) {
        if (location && location.trim()) {
            this.query.location = new RegExp(location.trim(), "i");
        }
        return this;
    }
    addWorkingTypeFilter(jobWorkingType) {
        if (jobWorkingType) {
            this.query.jobWorkingType = Array.isArray(jobWorkingType)
                ? { $in: jobWorkingType }
                : jobWorkingType;
        }
        return this;
    }
    addSalaryFilter(salaryMin, salaryMax) {
        if (salaryMin || salaryMax) {
            this.query["salary.max"] = this.query["salary.max"] || {};
            if (salaryMin) {
                const min = Number(salaryMin);
                if (!isNaN(min)) {
                    this.query["salary.max"] = { $gte: min };
                }
            }
            if (salaryMax) {
                const max = Number(salaryMax);
                if (!isNaN(max)) {
                    this.query["salary.min"] = { $lte: max };
                }
            }
        }
        return this;
    }
    addStatusFilter(status) {
        if (status) {
            if (Array.isArray(status)) {
                this.query.status = { $in: status };
            }
            else {
                this.query.status = status;
            }
        }
        else {
            this.query.status = "";
        }
        return this;
    }
    addTalentFinderFilter(talentFinderId) {
        if (talentFinderId) {
            this.query.talentFinderId = talentFinderId;
        }
        return this;
    }
    addSkillsFilter(skills) {
        if (skills) {
            const skillsArray = Array.isArray(skills)
                ? skills
                : skills.split(",").map((s) => s.trim());
            if (skillsArray.length > 0) {
                this.query.skills = { $in: skillsArray };
            }
        }
        return this;
    }
    addDateRangeFilter(startDate, endDate) {
        if (startDate || endDate) {
            this.query.createdAt = {};
            if (startDate) {
                this.query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                this.query.createdAt.$lte = new Date(endDate);
            }
        }
        return this;
    }
    addDeadlineFilter(includeExpired = false) {
        if (!includeExpired) {
            this.query.$or = this.query.$or || [];
            this.query.$or.push({ applicationDeadline: { $gt: new Date() } }, { applicationDeadline: { $exists: false } });
        }
        return this;
    }
    build() {
        return this.query;
    }
    reset() {
        this.query = {};
        return this;
    }
}
exports.JobQueryBuilder = JobQueryBuilder;
function buildJobQuery(queryParams, options) {
    const builder = new JobQueryBuilder();
    const splitCommaSeparated = (value) => {
        if (!value)
            return undefined;
        if (Array.isArray(value))
            return value;
        return value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
    };
    // Normalize multi-value params
    const jobTypes = splitCommaSeparated(queryParams.jobType);
    const experienceLevels = splitCommaSeparated(queryParams.experienceLevel);
    const workingTypes = splitCommaSeparated(queryParams.jobWorkingType);
    const statuses = splitCommaSeparated(queryParams.status);
    // Apply filters
    builder
        .addSearchFilter(queryParams.search)
        .addJobTypeFilter(jobTypes)
        .addExperienceLevelFilter(experienceLevels)
        .addLocationFilter(queryParams.location)
        .addWorkingTypeFilter(workingTypes)
        .addSalaryFilter(queryParams.salaryMin, queryParams.salaryMax);
    // Optional filters
    if (options?.talentFinderId) {
        builder.addTalentFinderFilter(options.talentFinderId);
    }
    // Handle status
    if (options?.onlyActive) {
        builder.addStatusFilter("active");
    }
    else {
        if (statuses && statuses.length > 0) {
            builder.addStatusFilter(statuses);
        }
        else if (options?.defaultStatus) {
            builder.addStatusFilter(options.defaultStatus);
        }
    }
    // Deadline (expired jobs)
    //   if (!options?.includeExpired) {
    //     builder.addDeadlineFilter(false);
    //   }
    return builder.build();
}
function buildJobSortOptions(sortBy, sortOrder) {
    const order = (sortOrder === "asc" ? 1 : -1);
    switch (sortBy) {
        case "title":
            return { title: order };
        case "salary":
            return { "salary.max": order };
        case "deadline":
            return { applicationDeadline: order };
        case "views":
            return { viewsCount: order };
        case "applicants":
            return { applicantsCount: order };
        case "createdAt":
        default:
            return { createdAt: order };
    }
}
//# sourceMappingURL=job.queryBuilder.js.map