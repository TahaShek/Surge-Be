import { BaseDocument, Ref } from "./common";
import { ITalentFinder } from "./talentFinder.types";

export interface IJob extends BaseDocument {
  talentFinderId: Ref<ITalentFinder>;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  skills: string[];
  jobType: "full-time" | "part-time" | "contract" | "freelance";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  location?: string;
  jobWorkingType: "remote" | "on-site" | "hybrid";
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  applicationDeadline?: Date;
  status: "draft" | "active" | "closed" | "filled";
  applicantsCount?: number;
  viewsCount?: number;
  jobCode?: string;
  totalPositions?: number;
}

export interface JobDocument extends IJob {}

export interface JobModelType {
  // Add custom static methods here if needed
}
