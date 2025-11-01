import { FilterQuery } from "mongoose";
import { IJob } from "../../@types/models/job.types";
import { GetAllJobsQuery } from "./job.validator";
export declare class JobQueryBuilder {
    private query;
    addSearchFilter(search?: string): this;
    addJobTypeFilter(jobType?: string | string[]): this;
    addExperienceLevelFilter(experienceLevel?: string | string[]): this;
    addLocationFilter(location?: string): this;
    addWorkingTypeFilter(jobWorkingType?: string | string[]): this;
    addSalaryFilter(salaryMin?: string, salaryMax?: string): this;
    addStatusFilter(status?: string | string[]): this;
    addTalentFinderFilter(talentFinderId?: string): this;
    addSkillsFilter(skills?: string | string[]): this;
    addDateRangeFilter(startDate?: string, endDate?: string): this;
    addDeadlineFilter(includeExpired?: boolean): this;
    build(): FilterQuery<IJob>;
    reset(): this;
}
export declare function buildJobQuery(queryParams: GetAllJobsQuery, options?: {
    talentFinderId?: string;
    onlyActive?: boolean;
    includeExpired?: boolean;
    defaultStatus?: string | string[];
}): FilterQuery<IJob>;
export declare function buildJobSortOptions(sortBy?: string, sortOrder?: string): Record<string, 1 | -1>;
//# sourceMappingURL=job.queryBuilder.d.ts.map