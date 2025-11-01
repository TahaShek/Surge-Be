import { FilterQuery } from "mongoose";
import { IJob } from "../../@types/models/job.types";
import { GetAllJobsQuery } from "./job.validator";

export class JobQueryBuilder {
  private query: FilterQuery<IJob> = {};

  addSearchFilter(search?: string): this {
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      this.query.$or = [
        { title: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }
    return this;
  }
  addJobTypeFilter(jobType?: string | string[]): this {
    if (jobType) {
      this.query.jobType = Array.isArray(jobType) ? { $in: jobType } : jobType;
    }
    return this;
  }

  addExperienceLevelFilter(experienceLevel?: string | string[]): this {
    if (experienceLevel) {
      this.query.experienceLevel = Array.isArray(experienceLevel)
        ? { $in: experienceLevel }
        : experienceLevel;
    }
    return this;
  }
  addLocationFilter(location?: string): this {
    if (location && location.trim()) {
      this.query.location = new RegExp(location.trim(), "i");
    }
    return this;
  }

  addWorkingTypeFilter(jobWorkingType?: string | string[]): this {
    if (jobWorkingType) {
      this.query.jobWorkingType = Array.isArray(jobWorkingType)
        ? { $in: jobWorkingType }
        : jobWorkingType;
    }
    return this;
  }

  addSalaryFilter(salaryMin?: string, salaryMax?: string): this {
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

  addStatusFilter(status?: string | string[]): this {
    if (status) {
      if (Array.isArray(status)) {
        this.query.status = { $in: status };
      } else {
        this.query.status = status;
      }
    } else {
      this.query.status = "";
    }
    return this;
  }

  addTalentFinderFilter(talentFinderId?: string): this {
    if (talentFinderId) {
      this.query.talentFinderId = talentFinderId;
    }
    return this;
  }

  addSkillsFilter(skills?: string | string[]): this {
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

  addDateRangeFilter(startDate?: string, endDate?: string): this {
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

  addDeadlineFilter(includeExpired: boolean = false): this {
    if (!includeExpired) {
      this.query.$or = this.query.$or || [];
      this.query.$or.push(
        { applicationDeadline: { $gt: new Date() } },
        { applicationDeadline: { $exists: false } }
      );
    }
    return this;
  }

  build(): FilterQuery<IJob> {
    return this.query;
  }

  reset(): this {
    this.query = {};
    return this;
  }
}

export function buildJobQuery(
  queryParams: GetAllJobsQuery,
  options?: {
    talentFinderId?: string;
    includeExpired?: boolean;
    defaultStatus?: string | string[];
  }
): FilterQuery<IJob> {
  const builder = new JobQueryBuilder();

  const splitCommaSeparated = (value?: string | string[]) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
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
  if (statuses && statuses.length > 0) {
    builder.addStatusFilter(statuses);
  } else if (options?.defaultStatus) {
    builder.addStatusFilter(options.defaultStatus);
  }

  // Deadline (expired jobs)
  if (!options?.includeExpired) {
    builder.addDeadlineFilter(false);
  }

  return builder.build();
}

export function buildJobSortOptions(
  sortBy?: string,
  sortOrder?: string
): Record<string, 1 | -1> {
  const order = (sortOrder === "asc" ? 1 : -1) as 1 | -1;

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
